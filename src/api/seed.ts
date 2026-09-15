import type { Customer, Order, OrderLine } from './types'

const CUSTOMERS: Customer[] = [
  { id: 'c01', name: 'Nordlys Kaffe AS', email: 'post@nordlyskaffe.no' },
  { id: 'c02', name: 'Fjordbrygg', email: 'bestilling@fjordbrygg.no' },
  { id: 'c03', name: 'Bergen Bokhandel', email: 'innkjop@bergenbok.no' },
  { id: 'c04', name: 'Solvik Snekkeri', email: 'ole@solvik.no' },
  { id: 'c05', name: 'Aurora Design Studio', email: 'hello@auroradesign.no' },
  { id: 'c06', name: 'Havnegata Sykkel', email: 'verksted@havnegata.no' },
  { id: 'c07', name: 'Lillehammer Ski & Sport', email: 'butikk@lhsport.no' },
  { id: 'c08', name: 'Tromsø Tekstil', email: 'ordre@tromsotekstil.no' },
  { id: 'c09', name: 'Grønn Gartner', email: 'kontakt@gronngartner.no' },
  { id: 'c10', name: 'Stavanger Stål', email: 'salg@stavangerstaal.no' },
]

const CATALOG: Array<Omit<OrderLine, 'quantity'>> = [
  { sku: 'MUG-001', name: 'Ceramic mug, 30cl', unitPriceCents: 14900 },
  { sku: 'TEE-M', name: 'Organic cotton tee (M)', unitPriceCents: 29900 },
  { sku: 'TEE-L', name: 'Organic cotton tee (L)', unitPriceCents: 29900 },
  { sku: 'NB-A5', name: 'Notebook A5, dotted', unitPriceCents: 9900 },
  { sku: 'PEN-BLK', name: 'Gel pen, black', unitPriceCents: 3900 },
  { sku: 'BAG-TOTE', name: 'Canvas tote bag', unitPriceCents: 19900 },
  { sku: 'CAP-NAVY', name: 'Cap, navy', unitPriceCents: 24900 },
  { sku: 'STK-PK', name: 'Sticker pack (12)', unitPriceCents: 5900 },
  { sku: 'BTL-500', name: 'Steel bottle 500ml', unitPriceCents: 34900 },
  { sku: 'HDY-XL', name: 'Hoodie (XL)', unitPriceCents: 69900 },
]

const STATUSES = ['draft', 'pending', 'paid', 'shipped', 'delivered', 'cancelled']

// Small deterministic PRNG so the seed data is stable between reloads.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildSeedOrders(count = 42): Order[] {
  const rand = mulberry32(1337)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
  const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1))

  const orders: Order[] = []
  const base = Date.UTC(2026, 8, 14, 12, 0, 0)

  for (let i = 0; i < count; i++) {
    const lineCount = int(1, 4)
    const lines: OrderLine[] = []
    const used = new Set<string>()
    while (lines.length < lineCount) {
      const item = pick(CATALOG)
      if (used.has(item.sku)) continue
      used.add(item.sku)
      lines.push({ ...item, quantity: int(1, 12) })
    }

    const ageDays = int(0, 90)
    const createdAt = new Date(base - ageDays * 86_400_000 - int(0, 86_399) * 1000).toISOString()

    orders.push({
      id: `ORD-${String(1000 + i).padStart(4, '0')}`,
      customer: pick(CUSTOMERS),
      createdAt,
      status: pick(STATUSES),
      currency: 'NOK',
      lines,
      discountPercent: rand() < 0.3 ? pick([5, 10, 15, 20]) : 0,
      shippingCents: rand() < 0.2 ? 0 : pick([4900, 7900, 12900]),
      notes: rand() < 0.15 ? 'Customer asked for delivery before the weekend.' : undefined,
    })
  }

  return orders
}
