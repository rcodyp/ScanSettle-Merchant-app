"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { SectionHeader } from "./HowItWorks";

type Status = "idle" | "pending" | "confirmed";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" },
  { code: "SGD", symbol: "S$" },
];

export function PosDemo() {
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("42.00");
  const [label, setLabel] = useState("Espresso + croissant");
  const [status, setStatus] = useState<Status>("idle");

  const sym = currencies.find((c) => c.code === currency)?.symbol ?? "$";
  const payload = `scansettle://pay?amount=${amount}&cur=${currency}&label=${encodeURIComponent(label)}`;

  function generate() {
    setStatus("pending");
    setTimeout(() => setStatus("confirmed"), 2600);
  }
  function reset() {
    setStatus("idle");
  }

  return (
    <section id="demo" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Live POS Demo"
          title="Try the merchant terminal"
          desc="A real, in-browser preview of the ScanSettle point-of-sale. No install required."
        />

        <div className="mt-14 mx-auto max-w-5xl glass-strong rounded-3xl p-3 sm:p-5">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <div className="text-xs text-muted-foreground">Merchant: Blue Bottle · NYC</div>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-3">
            {/* Form */}
            <div className="rounded-2xl bg-[oklch(0.11_0.012_270)] p-6 sm:p-8">
              <div className="text-xs text-muted-foreground mb-1">New charge</div>
              <div className="text-lg font-semibold mb-6">Create a payment</div>

              <Field label="Currency">
                <div className="flex flex-wrap gap-1.5">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code)}
                      disabled={status !== "idle"}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        currency === c.code
                          ? "bg-gradient-brand text-[#0a0a0a]"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{sym}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status !== "idle"}
                    className="w-full rounded-xl glass px-8 py-3 text-2xl font-semibold tracking-tight outline-none focus:ring-2 focus:ring-[var(--solana-green)]/40"
                  />
                </div>
              </Field>

              <Field label="Label (optional)">
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  disabled={status !== "idle"}
                  placeholder="What's this charge for?"
                  className="w-full rounded-xl glass px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--solana-green)]/40 placeholder:text-muted-foreground/60"
                />
              </Field>

              <div className="mt-7 flex gap-2">
                {status === "idle" && (
                  <button
                    onClick={generate}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-[#0a0a0a] hover:opacity-95 transition"
                  >
                    Generate QR
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </button>
                )}
                {status !== "idle" && (
                  <button
                    onClick={reset}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl glass px-4 py-3 text-sm font-medium hover:bg-white/5 transition"
                  >
                    New charge
                  </button>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
                <Mini label="Network" value="Solana" />
                <Mini label="Settle" value="USDC" />
                <Mini label="Fee" value="0.3%" />
              </div>
            </div>

            {/* QR / Status */}
            <div className="relative rounded-2xl bg-[oklch(0.11_0.012_270)] p-6 sm:p-8 overflow-hidden">
              <div className="text-xs text-muted-foreground mb-1">Customer view</div>
              <div className="text-lg font-semibold mb-6 flex items-center justify-between">
                {sym}{amount} <StatusBadge status={status} />
              </div>

              <div className="relative grid place-items-center min-h-[260px]">
                <AnimatePresence mode="wait">
                  {status === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="text-center text-sm text-muted-foreground max-w-xs"
                    >
                      Enter an amount and tap <span className="text-foreground font-medium">Generate QR</span> to start a charge.
                    </motion.div>
                  )}
                  {status === "pending" && (
                    <motion.div
                      key="pending"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <div className="absolute -inset-4 bg-gradient-brand opacity-30 blur-2xl rounded-3xl animate-pulse" />
                      <div className="relative rounded-2xl bg-white p-3">
                        <QRCodeSVG value={payload} size={180} level="H" />
                      </div>
                      <div className="mt-4 text-center text-xs text-muted-foreground">
                        Waiting for customer · any chain
                      </div>
                    </motion.div>
                  )}
                  {status === "confirmed" && (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className="text-center"
                    >
                      <div className="relative mx-auto h-20 w-20 rounded-full bg-gradient-brand grid place-items-center ring-glow">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <div className="mt-5 text-base font-semibold">Payment received</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Settled <span className="text-foreground font-medium">{amount} USDC</span> on Solana
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-md glass px-2 py-1 text-[11px] text-muted-foreground">
                        tx · 4f8…a91 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg glass px-2.5 py-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { color: string; label: string }> = {
    idle: { color: "text-muted-foreground", label: "● Idle" },
    pending: { color: "text-[var(--electric-blue)]", label: "● Awaiting" },
    confirmed: { color: "text-[var(--solana-green)]", label: "● Confirmed" },
  };
  const s = map[status];
  return <span className={`rounded-full glass px-2.5 py-1 text-[10px] font-medium ${s.color}`}>{s.label}</span>;
}
