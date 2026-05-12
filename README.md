# ScanSettle

ScanSettle is a cross-chain crypto POS and merchant dashboard built with Next.js. It lets merchants accept payments from a checkout flow, inspect dashboard metrics, and review transactions while settling in SOL on Solana.

This repository is designed to be easy to pick up for a new developer:

- The landing page explains the product.
- The dashboard is wallet-gated and shows merchant activity.
- API routes proxy KiraPay data and handle the payment flow.
- A small in-memory order store powers the demo payment experience.

## What the app does

At a high level, the app provides:

- A marketing site with product sections like Hero, How It Works, Problem, Features, Trust, and CTA.
- A connected-wallet dashboard for merchants.
- Dashboard pages for Overview, Accept Payment, Transactions, and Settings.
- Server routes that fetch payment stats, sales trends, and transaction history from KiraPay.
- A demo order store that simulates order creation and payment confirmation.

## Tech Stack

- Next.js 15 with the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style component primitives
- Solana wallet adapter packages
- Recharts for dashboard charts

## Project Structure

- `src/app/page.tsx` - landing page composition
- `src/app/layout.tsx` - root layout, fonts, and Solana provider
- `src/app/dashboard/layout.tsx` - dashboard shell, wallet gate, and sidebar navigation
- `src/app/dashboard/overview/page.tsx` - overview metrics and recent activity
- `src/app/dashboard/payment/PaymentFlow.tsx` - payment creation flow
- `src/app/dashboard/transaction/page.tsx` - paginated transaction list
- `src/app/dashboard/setting/page.tsx` - connected wallet and merchant details
- `src/app/api/check-payment/route.ts` - KiraPay payment stats proxy
- `src/app/api/create-order/route.ts` - create a payment link/order payload
- `src/app/api/sales-trends/route.jsx` - KiraPay sales trend proxy
- `src/app/api/transactions/route.jsx` - KiraPay transaction history proxy
- `src/app/api/webhook/kirapay/route.ts` - webhook-style payment confirmation endpoint
- `src/lib/orders.server.ts` - in-memory demo order store and helpers

## Main User Flows

### Public site

The home page renders the product story and navigation. It is composed from the site sections in `src/components/site`.

### Dashboard access

The dashboard requires a connected Solana wallet. If no wallet is connected, the layout shows a connect prompt instead of the dashboard content.

### Overview page

The overview page fetches:

- payment stats from `GET /api/check-payment`
- sales trend data from `GET /api/sales-trends`
- recent transactions from `GET /api/transactions?page=1&limit=10`

It then displays summary cards, a line chart, and recent transaction rows.

### Payment flow

The payment flow creates a demo order, builds a checkout URL, and uses the in-memory order store to simulate settlement during development.

### Transactions and settings

- Transactions shows paginated payment history.
- Settings shows the connected wallet plus merchant settlement details.

## Environment Variables

Create a local `.env` file with the KiraPay key used by the server routes:

```bash
KIRAPAY_API_KEY=your_kirapay_api_key_here
```

Notes:

- The dashboard and API routes expect this variable to exist when calling KiraPay endpoints.
- The marketing site contains a code example that references `SS_KEY`, but that is displayed as documentation content rather than a runtime requirement for this app.

## Getting Started

### Prerequisites

- Node.js 18.18+ or newer
- pnpm

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Then open the local app URL printed by Next.js.

### Build for production

```bash
pnpm build
```

### Start the production server

```bash
pnpm start
```

### Lint the codebase

```bash
pnpm lint
```

### Format the codebase

```bash
pnpm format
```

## API Routes

### GET /api/check-payment

Fetches payment summary stats from KiraPay.

### POST /api/create-order

Creates a checkout payload for a payment request.

Expected body shape:

```json
{
  "amount": 42,
  "currency": "USD",
  "receiver": "merchant-wallet-address",
  "label": "Payment for Order"
}
```

### GET /api/sales-trends

Fetches the last seven days of sales trend data from KiraPay.

### GET /api/transactions?page=1&limit=10

Fetches paginated transaction history from KiraPay.

### POST /api/webhook/kirapay

Marks a demo order as paid by order ID.

Expected body shape:

```json
{
  "orderId": "ss_example",
  "txHash": "0xabc123"
}
```

## Demo Order Store

The local order store in `src/lib/orders.server.ts` is intentionally simple:

- Orders are stored in memory.
- Data resets on restart or cold start.
- Orders can auto-confirm after a short delay to simulate settlement.

This is useful for demos, hackathons, and local testing, but it should be replaced with persistent storage if you need durable orders.

## How the Dashboard Is Organized

The dashboard layout in `src/app/dashboard/layout.tsx` handles:

- wallet connection checks
- the desktop sidebar
- the mobile sidebar toggle
- scroll isolation so the sidebar stays fixed while content scrolls

The dashboard content itself is rendered inside the layout shell, so each page only needs to focus on its own data and UI.

## Contributing Notes

If you are new to the codebase, start here:

1. Read `src/app/layout.tsx` to understand the root app shell.
2. Read `src/app/dashboard/layout.tsx` to understand the authenticated dashboard shell.
3. Read `src/lib/orders.server.ts` to understand the demo order flow.
4. Read the API routes in `src/app/api` to understand where data comes from.
5. Use the dashboard pages as examples when adding new sections or tables.

When making changes:

- Keep the dashboard layout and page content separated.
- Prefer typed data shapes for any new server responses.
- Update this README if you add new routes, env vars, or major user flows.

## Troubleshooting

- If the dashboard asks for a wallet connection, connect a Solana wallet extension first.
- If KiraPay requests fail, confirm `KIRAPAY_API_KEY` is present in your environment.
- If demo orders disappear after restart, that is expected because the store is in memory only.

## License

No license file is currently present in the repository.
