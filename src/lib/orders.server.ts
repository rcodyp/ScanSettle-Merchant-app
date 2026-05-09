// Simple in-memory order store. Resets on cold start — fine for demo/hackathon.
export type Order = {
  id: string;
  amount: number;
  currency: string;
  label?: string;
  merchantWallet: string;
  settlementToken: string;
  settlementChain: string;
  createdAt: number;
  status: "pending" | "paid";
  paidAt?: number;
  txHash?: string;
};

const orders = new Map<string, Order>();

export function createOrder(input: Omit<Order, "id" | "createdAt" | "status">): Order {
  const id = `ss_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const order: Order = { ...input, id, createdAt: Date.now(), status: "pending" };
  orders.set(id, order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  const order = orders.get(id);
  if (!order) return undefined;
  // Demo auto-confirm: simulate KIRAPAY settlement after 10s.
  if (order.status === "pending" && Date.now() - order.createdAt > 10_000) {
    order.status = "paid";
    order.paidAt = Date.now();
    order.txHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
  }
  return order;
}

export function markPaid(id: string, txHash?: string): Order | undefined {
  const order = orders.get(id);
  if (!order) return undefined;
  order.status = "paid";
  order.paidAt = Date.now();
  order.txHash = txHash ?? order.txHash;
  return order;
}

export function buildKirapayUrl(order: Order): string {
  const params = new URLSearchParams({
    orderId: order.id,
    amount: String(order.amount),
    currency: order.currency,
    merchant: order.merchantWallet,
    settleToken: order.settlementToken,
    settleChain: order.settlementChain,
  });
  if (order.label) params.set("label", order.label);
  return `https://checkout.kirapay.xyz/pay?${params.toString()}`;
}
