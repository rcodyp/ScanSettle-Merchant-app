# ScanSettle

ScanSettle is a cross-chain crypto checkout terminal and merchant dashboard built with Next.js. It lets merchants accept payments from any wallet on any blockchain and always settle in SOL on Solana.

This repository is designed to be easy to pick up for a new developer:

- The landing page explains the product.
- The dashboard is wallet-gated and shows merchant activity.
- API routes proxy KiraPay data and handle the payment flow.
- A small in-memory order store powers the demo payment experience.

## What the app does

- A marketing site with product sections: Hero, How It Works, Problem, Features, Trust, and CTA.
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

```
src/
├── app/
│   ├── error.tsx                         # App-level error boundary
│   ├── layout.tsx                        # Root layout, fonts, favicon, and Solana provider
│   ├── not-found.tsx                     # App-level 404 page
│   ├── page.tsx                          # Landing page composition
│   ├── dashboard/
│   │   ├── layout.tsx                    # Dashboard shell, wallet gate, sidebar
│   │   ├── overview/page.jsx             # Overview metrics and recent activity
│   │   ├── payment/
│   │   │   ├── PaymentFlow.tsx           # Payment creation flow
│   │   │   └── page.tsx                  # Accept-payment page wrapper
│   │   ├── setting/page.jsx              # Connected wallet and merchant details
│   │   └── transaction/page.tsx          # Paginated transaction list
│   ├── wallet/
│   │   ├── SolanaProvider.tsx            # Wallet adapter provider
│   │   └── Wallet.tsx                    # Wallet UI helpers
│   └── api/
│       ├── check-payment/route.ts        # KiraPay payment stats proxy
│       ├── create-order/route.ts         # Create a payment link/order payload
│       ├── sales-trends/route.jsx        # KiraPay sales trend proxy
│       ├── transactions/route.jsx        # KiraPay transaction history proxy
│       └── webhook/kirapay/route.ts      # Payment confirmation webhook endpoint
├── components/
│   ├── app/AppShell.tsx                  # Shared application shell
│   ├── site/                             # Marketing site sections
│   └── ui/                               # shadcn/ui-style primitives
├── hooks/
│   └── use-mobile.tsx                    # Mobile breakpoint hook
└── lib/
    ├── error-capture.ts                 # Error capture helpers
    ├── error-page.ts                    # Error page helpers
    ├── orders.server.ts                 # In-memory demo order store and helpers
    └── utils.ts                         # Shared utility helpers
```

## Main User Flows

### Public site
The home page renders the product story and navigation, composed from sections in `src/components/site`.

### Dashboard access
The dashboard requires a connected Solana wallet. If no wallet is connected, the layout shows a connect prompt instead of the dashboard content.

### Overview page
Fetches payment stats, sales trend data, and recent transactions, then displays summary cards, a line chart, and recent transaction rows.

### Payment flow
Creates a demo order, builds a checkout URL, and uses the in-memory order store to simulate settlement during development.

### Transactions and settings
- Transactions shows paginated payment history.
- Settings shows the connected wallet and merchant settlement details.

## Getting Started

### Prerequisites

- Node.js 18.18+
- pnpm

### 1. Clone the repository

```bash
git clone https://github.com/rcodyp/ScanSettle-Merchant-app
cd scan-settle
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example file:

```bash
cp .env.example .env
```

Open `.env` and add your KiraPay API key:

```bash
KIRAPAY_API_KEY=your_kirapay_api_key_here
```

The Solana network and RPC endpoint are optional — they default to devnet if not set:

```bash
# Optional
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-custom-rpc-url
```

### 4. Run the development server

```bash
pnpm dev
```

Open the local URL printed by Next.js.

### 5. Build for production

```bash
pnpm build
pnpm start
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `KIRAPAY_API_KEY` | Yes | — | API key for KiraPay payment integration |
| `NEXT_PUBLIC_SOLANA_NETWORK` | No | `devnet` | Solana network: `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Public devnet RPC | Custom RPC endpoint (Helius, QuickNode, etc.) |

**Notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Only use them for non-sensitive data.
- Never commit real API keys to the repository.
- See `.env.example` for a ready-to-copy template of all variables.

## API Routes

### `GET /api/check-payment`
Fetches payment summary stats from KiraPay.

### `POST /api/create-order`
Creates a checkout payload for a payment request.

```json
{
  "amount": 42,
  "currency": "USD",
  "receiver": "merchant-wallet-address",
  "label": "Payment for Order"
}
```

### `GET /api/sales-trends`
Fetches the last seven days of sales trend data from KiraPay.

### `GET /api/transactions?page=1&limit=10`
Fetches paginated transaction history from KiraPay.

### `POST /api/webhook/kirapay`
Marks a demo order as paid by order ID.

```json
{
  "orderId": "ss_example",
  "txHash": "0xabc123"
}
```

## Demo Order Store

The order store in `src/lib/orders.server.ts` is intentionally simple:

- Orders are stored in memory and reset on every restart.
- Orders can auto-confirm after a short delay to simulate settlement.

Useful for demos and local testing. Replace with persistent storage for production.

## Other Commands

```bash
pnpm lint       # Lint the codebase
pnpm format     # Format the codebase
```

## Contributing

If you are new to the codebase, start here:

1. `src/app/layout.tsx` — root app shell
2. `src/app/dashboard/layout.tsx` — authenticated dashboard shell
3. `src/lib/orders.server.ts` — demo order flow
4. `src/app/api/` — where data comes from

When making changes:
- Keep dashboard layout and page content separated.
- Prefer typed data shapes for new server responses.
- Update this README if you add new routes, env vars, or major flows.

## Troubleshooting

| Problem | Fix |
|---|---|
| Dashboard asks for wallet connection | Install a Solana wallet (Phantom, Solflare) and connect it |
| KiraPay requests failing | Check that `KIRAPAY_API_KEY` is set in your `.env` file |
| Demo orders disappear on restart | Expected — the store is in-memory only |
| Wallet not showing on mobile | Open the site inside your wallet app's built-in browser |

## License

No license file is currently present in the repository.