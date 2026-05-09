import { createFileRoute } from "@tanstack/react-router";
import { getOrder } from "@/lib/orders.server";

export const Route = createFileRoute("/api/check-payment")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("orderId");
        if (!id) return Response.json({ error: "Missing orderId" }, { status: 400 });
        const order = getOrder(id);
        if (!order) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json({ order });
      },
    },
  },
});
