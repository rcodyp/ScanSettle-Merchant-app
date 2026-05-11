"use client";

import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
// import { getAuth, getMerchant, type Merchant } from "@/lib/merchant-store";
import { getMerchant, type Merchant } from "@/lib/merchant-store";

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

export function PosClient() {
  const router = useRouter();
  const [merchant, setMerchantState] = useState<Merchant | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [label, setLabel] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef<number | null>(null);

  // useEffect(() => {
  //   // if (!getAuth()) {
  //   //   router.push("/login");
  //   //   return;
  //   // }
  //   const currentMerchant = getMerchant();
  //   if (!currentMerchant?.walletAddress) {
  //     router.push("/setup");
  //     return;
  //   }
  //   setMerchantState(currentMerchant);
  // }, [router]);

  // useEffect(() => {
  //   if (!checkoutUrl) return;
  //   QRCode.toDataURL(checkoutUrl, {
  //     margin: 1,
  //     width: 360,
  //     color: { dark: "#0b0f17", light: "#ffffff" },
  //   }).then(setQrDataUrl);
  // }, [checkoutUrl]);

  // useEffect(() => {
  //   if (!order || order.status === "paid") {
  //     if (pollRef.current) window.clearInterval(pollRef.current);
  //     return;
  //   }
  //   pollRef.current = window.setInterval(async () => {
  //     try {
  //       const response = await fetch(`/api/check-payment?orderId=${order.id}`);
  //       if (!response.ok) return;
  //       const data = await response.json();
  //       if (data.order?.status === "paid") {
  //         setOrder((current) => (current ? { ...current, ...data.order } : current));
  //       }
  //     } catch {
  //       // Ignore polling errors in the demo flow.
  //     }
  //   }, 3000);
  //   return () => {
  //     if (pollRef.current) window.clearInterval(pollRef.current);
  //   };
  // }, [order]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amountValue = Number(amount);
    if (!amountValue || amountValue <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!merchant) return;
    setLoading(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountValue,
          currency,
          label,
          merchantWallet: merchant.walletAddress,
          settlementToken: merchant.settlementToken,
          settlementChain: merchant.settlementChain,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");
      setOrder(data.order);
      setCheckoutUrl(data.checkoutUrl);
    } catch (problem) {
      setError((problem as Error).message);
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

  // if (!merchant) {
  //   return (
  //     <AppShell>
  //       <p className="text-muted-foreground">Loading…</p>
  //     </AppShell>
  //   );
  // }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight">New payment</h1>
          {/* <p className="mt-1 text-sm text-muted-foreground">
            Settling to <span className="text-foreground">{merchant.settlementToken} on {merchant.settlementChain}</span>
          </p> */}

          <form onSubmit={generate} className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <label className="col-span-1">
                <span className="text-xs text-muted-foreground">Currency</span>
                <select className="input mt-1.5" value={currency} onChange={(e) => setCurrency(e.target.value)} disabled={!!order}>
                  {CURRENCIES.map((currencyOption) => (
                    <option key={currencyOption}>{currencyOption}</option>
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
              <span className="text-xs text-muted-foreground">Label (table number, order ID, invoice note)</span>
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
              <button disabled={loading} className="w-full rounded-md bg-foreground py-3 font-medium text-background hover:opacity-90 disabled:opacity-50">
                {loading ? "Generating…" : "Generate payment QR"}
              </button>
            ) : (
              <button type="button" onClick={reset} className="w-full rounded-md border border-white/15 py-3 hover:bg-white/5">
                New payment
              </button>
            )}
          </form>

          {order && (
            <div className="mt-6 space-y-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
              <Row k="Order ID" v={<span className="font-mono text-xs">{order.id}</span>} />
              <Row k="Amount" v={`${order.amount.toFixed(2)} ${order.currency}`} />
              {order.label && <Row k="Label" v={order.label} />}
              <Row k="Settle" v={`${order.settlementToken} on ${order.settlementChain}`} />
            </div>
          )}
        </section>

        <section className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            {!order ? <EmptyQr /> : order.status === "paid" ? <PaidView order={order} /> : <PendingView qr={qrDataUrl} url={checkoutUrl} />}
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
      <span className="break-all text-right text-foreground">{v}</span>
    </div>
  );
}

function EmptyQr() {
  return (
    <div className="flex aspect-square flex-col items-center justify-center text-center text-muted-foreground">
      <div className="mb-3 h-16 w-16 rounded-xl border-2 border-dashed border-white/15" />
      <p className="text-sm">Enter an amount to generate a QR code</p>
    </div>
  );
}

function PendingView({ qr, url }: { qr: string; url: string }) {
  return (
    <div className="text-center">
      <div className="inline-block rounded-xl bg-white p-4">
        {qr ? <img src={qr} alt="Payment QR" className="block h-[280px] w-[280px]" /> : <p className="w-[280px] text-sm text-muted-foreground">Loading QR…</p>}
      </div>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>Customer checkout URL</p>
        <a href={url} className="break-all text-foreground underline">
          {url}
        </a>
      </div>
    </div>
  );
}

function PaidView({ order }: { order: Order }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-2xl text-emerald-400">
        ✓
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">Payment received</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {order.amount.toFixed(2)} {order.currency} has been settled.
        </p>
      </div>
      {order.txHash && <p className="break-all text-xs text-muted-foreground">TX: {order.txHash}</p>}
    </div>
  );
}