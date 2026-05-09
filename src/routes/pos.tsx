import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { AppShell } from "@/components/app/AppShell";
import { getAuth, getMerchant, type Merchant } from "@/lib/merchant-store";

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "SGD"];

type Order = {
  id: string;
  amount: number;
  currency: string;
  label?: string;
  status: "pending" | "paid";
  paidAt?: number;
  txHash?: string;
  settlementToken: string;
  settlementChain: string;
};

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "POS — ScanSettle" },
      { name: "description", content: "Generate a payment QR for your customer." },
    ],
  }),
  component: PosPage,
});

function PosPage() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [label, setLabel] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!getAuth()) {
      navigate({ to: "/login" });
      return;
    }
    const m = getMerchant();
    if (!m?.walletAddress) {
      navigate({ to: "/setup" });
      return;
    }
    setMerchant(m);
  }, [navigate]);

  useEffect(() => {
    if (!checkoutUrl) return;
    QRCode.toDataURL(checkoutUrl, {
      margin: 1,
      width: 360,
      color: { dark: "#0b0f17", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [checkoutUrl]);

  useEffect(() => {
    if (!order || order.status === "paid") {
      if (pollRef.current) window.clearInterval(pollRef.current);
      return;
    }
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/check-payment?orderId=${order.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.order?.status === "paid") {
          setOrder((o) => (o ? { ...o, ...data.order } : o));
        }
      } catch {}
    }, 3000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [order]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!merchant) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          currency,
          label,
          merchantWallet: merchant.walletAddress,
          settlementToken: merchant.settlementToken,
          settlementChain: merchant.settlementChain,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOrder(data.order);
      setCheckoutUrl(data.checkoutUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrder(null);
    setCheckoutUrl("");
    setQrDataUrl("");
    setAmount("");
    setLabel("");
  };

  if (!merchant) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left: form */}
        <section>
          <h1 className="text-2xl font-semibold tracking-tight">New payment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Settling to{" "}
            <span className="text-foreground">
              {merchant.settlementToken} on {merchant.settlementChain}
            </span>
          </p>

          <form onSubmit={generate} className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <label className="col-span-1">
                <span className="text-xs text-muted-foreground">Currency</span>
                <select
                  className="input mt-1.5"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={!!order}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="col-span-2">
                <span className="text-xs text-muted-foreground">Amount</span>
                <input
                  className="input mt-1.5 text-2xl font-semibold tracking-tight tabular-nums"
                  placeholder="0.00"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!!order}
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-muted-foreground">
                Label (table number, order ID, invoice note)
              </span>
              <input
                className="input mt-1.5"
                placeholder="Table 4 / Order #1042"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={!!order}
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {!order ? (
              <button
                disabled={loading}
                className="w-full bg-foreground text-background font-medium py-3 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Generating…" : "Generate payment QR"}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="w-full border border-white/15 py-3 rounded-md hover:bg-white/5"
              >
                New payment
              </button>
            )}
          </form>

          {order && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm space-y-1.5">
              <Row k="Order ID" v={<span className="font-mono text-xs">{order.id}</span>} />
              <Row k="Amount" v={`${order.amount.toFixed(2)} ${order.currency}`} />
              {order.label && <Row k="Label" v={order.label} />}
              <Row k="Settle" v={`${order.settlementToken} on ${order.settlementChain}`} />
            </div>
          )}
        </section>

        {/* Right: QR + status */}
        <section className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            {!order ? (
              <EmptyQr />
            ) : order.status === "paid" ? (
              <PaidView order={order} />
            ) : (
              <PendingView qr={qrDataUrl} url={checkoutUrl} />
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-foreground text-right break-all">{v}</span>
    </div>
  );
}

function EmptyQr() {
  return (
    <div className="aspect-square flex flex-col items-center justify-center text-center text-muted-foreground">
      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/15 mb-3" />
      <p className="text-sm">Enter an amount to generate a QR code</p>
    </div>
  );
}

function PendingView({ qr, url }: { qr: string; url: string }) {
  return (
    <div className="text-center">
      <div className="bg-white p-4 rounded-xl inline-block">
        {qr ? (
          <img src={qr} alt="Payment QR" className="w-[280px] h-[280px] block" />
        ) : (
          <div className="w-[280px] h-[280px]" />
        )}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <p className="text-sm text-muted-foreground">Waiting for payment…</p>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Customer scans with any wallet — KIRAPAY routes the payment.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-muted-foreground hover:text-foreground underline mt-2 inline-block break-all"
      >
        Open checkout link
      </a>
    </div>
  );
}

function PaidView({ order }: { order: Order }) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h3 className="mt-4 text-xl font-semibold">Payment received</h3>
      <p className="text-3xl font-semibold tracking-tight mt-3 tabular-nums">
        {order.amount.toFixed(2)}{" "}
        <span className="text-base text-muted-foreground">{order.currency}</span>
      </p>
      <div className="mt-5 mx-auto max-w-sm rounded-lg border border-white/10 p-4 text-sm space-y-1.5 text-left">
        <Row k="Order ID" v={<span className="font-mono text-xs">{order.id}</span>} />
        <Row
          k="Settled"
          v={`${order.settlementToken} on ${order.settlementChain}`}
        />
        {order.txHash && (
          <Row k="Tx" v={<span className="font-mono text-xs">{order.txHash}</span>} />
        )}
      </div>
    </div>
  );
}
