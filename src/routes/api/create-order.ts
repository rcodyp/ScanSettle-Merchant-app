import { createFileRoute } from "@tanstack/react-router";
import { createOrder, buildKirapayUrl } from "@/lib/orders.server";

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const amount = Number(body.amount);
          if (!amount || amount <= 0) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
          }
          const order = createOrder({
            amount,
            currency: String(body.currency || "USD"),
            label: body.label ? String(body.label) : undefined,
            merchantWallet: String(body.merchantWallet || ""),
            settlementToken: String(body.settlementToken || "USDC"),
            settlementChain: String(body.settlementChain || "Solana"),
          });
          return Response.json({ order, checkoutUrl: buildKirapayUrl(order) });
        } catch (e) {
          return Response.json({ error: "Bad request" }, { status: 400 });
        }
      },
    },
  },
});
