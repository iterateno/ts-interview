# Ledgerly

A small internal dashboard for browsing and updating customer orders. It runs entirely in the browser against an in-memory API with simulated latency, so there is nothing to configure.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (normally http://localhost:5173).

Other scripts:

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm test`          | Run the unit tests once               |
| `npm run test:watch`| Run the unit tests in watch mode      |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | TypeScript, no emit                   |
| `npm run build`     | Production build to `dist/`           |

## What it does

- Lists orders with search, status filter and sorting.
- Shows a summary of order count, revenue and average order value for the current list.
- Opens an order in a side panel with line items, totals and a status control.

## Project layout

```
src/
  api/         In-memory API client, seed data and API types
  domain/      Pure business logic: money, filtering, sorting, statuses
  hooks/       React hooks that talk to the API
  components/  UI
```

## Business rules

These are the rules the application is expected to follow.

**Order total**

```
subtotal = sum(quantity × unitPrice) over all lines
discount = subtotal × discountPercent / 100   (rounded to whole cents)
total    = subtotal − discount + shipping
```

The discount never applies to shipping.

**Revenue**

Revenue is the sum of order totals for all orders that are **not** cancelled.

**Search**

Search matches against the order id and the customer name, and is case-insensitive.

**Status transitions**

| From      | To                   |
| --------- | -------------------- |
| draft     | pending, cancelled   |
| pending   | paid, cancelled      |
| paid      | shipped, cancelled   |
| shipped   | delivered            |
| delivered | (final)              |
| cancelled | (final)              |

## Backlog

**Bulk status update.** Users want to select several orders in the list and move all of them to a new status in one action, instead of opening each order individually. The bulk action must respect the same transition rules as the single-order status control, and orders that cannot make the transition should be left unchanged and reported to the user.
