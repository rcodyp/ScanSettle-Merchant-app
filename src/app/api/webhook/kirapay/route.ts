import { markPaid } from "@/lib/orders.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.orderId || "");
    if (!id) return Response.json({ error: "Missing orderId" }, { status: 400 });

    const order = markPaid(id, body.txHash);
    if (!order) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({ ok: true, order });
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
}