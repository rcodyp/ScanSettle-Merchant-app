"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

const tokens = [
  { sym: "ETH", color: "#627EEA", x: "8%", y: "18%", d: 0 },
  { sym: "SOL", color: "#14F195", x: "85%", y: "12%", d: 0.4 },
  { sym: "SOL", color: "#2775CA", x: "92%", y: "62%", d: 0.8 },
  { sym: "MATIC", color: "#8247E5", x: "5%", y: "70%", d: 1.2 },
  { sym: "BTC", color: "#F7931A", x: "78%", y: "85%", d: 0.6 },
];

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 noise" />

      {/* Floating tokens */}
      {tokens.map((t) => (
        <motion.div
          key={t.sym}
          className="hidden md:flex absolute z-10 items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium"
          style={{ left: t.x, top: t.y }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, delay: t.d, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold text-white"
            style={{ background: t.color }}
          >
            {t.sym[0]}
          </span>
          {t.sym}
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <a
            href="#kirapay"
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-7"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--solana-green)] animate-pulse" />
            Powered by KIRAPAY cross-chain infrastructure
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-[#0a0a0a] hover:opacity-95 transition"
            >
              Mainnet-Beta
            </a>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] leading-[1.02]">
            Accept any crypto.
            <br />
            <span className="text-gradient-brand">Settle in SOL on Solana.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ScanSettle lets physical merchants accept payments from any wallet, token, or blockchain
            — while automatically settling into SOL on Solana. One QR code. Any wallet. Any chain.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/dashboard/payment"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-[#0a0a0a] hover:opacity-95 transition"
            >
              Start Accepting Payments
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href="/#demo"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5 transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              View Demo
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check /> Non-custodial
            </div>
            <div className="flex items-center gap-1.5">
              <Check /> No setup fees
            </div>
            <div className="flex items-center gap-1.5">
              <Check /> Browser-based POS
            </div>
          </div>
        </motion.div>

        <HeroDashboard />
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#14F195" strokeWidth="3">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative mx-auto mt-16 max-w-5xl"
    >
      {/* Glow */}
      <div className="absolute -inset-x-20 -top-10 -bottom-10 bg-gradient-brand opacity-20 blur-3xl rounded-[40px] pointer-events-none" />

      <div className="relative glass-strong rounded-3xl p-3 sm:p-4 shadow-2xl">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 text-xs text-muted-foreground">scansettle.app/pos</span>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-3 p-1">
          {/* QR side */}
          <div className="rounded-2xl bg-[oklch(0.11_0.012_270)] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-muted-foreground">Amount due</div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
                  $42.00 <span className="text-base font-normal text-muted-foreground">USD</span>
                </div>
              </div>
              <span className="rounded-full glass px-2.5 py-1 text-[10px] font-medium text-[var(--solana-green)]">
                ● Awaiting payment
              </span>
            </div>

            <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-brand opacity-30 blur-xl rounded-2xl" />
                <div className="relative rounded-xl bg-white p-3">
                  <QRCodeSVG
                    value="https://scansettle.app/pay/demo"
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#0a0a0a"
                    level="H"
                    imageSettings={{
                      src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2314F195'/></svg>",
                      height: 28,
                      width: 28,
                      excavate: true,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Scan with any wallet</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Phantom", "MetaMask", "Coinbase", "Trust", "Rainbow"].map((w) => (
                    <span
                      key={w}
                      className="rounded-md glass px-2 py-1 text-[11px] text-muted-foreground"
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Pay in <span className="text-foreground">ETH · SOL · SOL · MATIC · BTC</span> from
                  any chain.
                </div>
              </div>
            </div>
          </div>

          {/* Routing visual */}
          <div className="rounded-2xl bg-[oklch(0.11_0.012_270)] p-6 sm:p-7">
            <div className="text-xs text-muted-foreground mb-1">Live cross-chain routing</div>
            <div className="text-sm font-medium mb-5">Customer → KIRAPAY → Merchant</div>

            <ChainRouting />

            <div className="mt-5 flex items-center justify-between rounded-xl glass px-3 py-2.5">
              <div className="text-xs">
                <div className="text-muted-foreground">Settlement</div>
                <div className="font-semibold">
                  42.00 SOL <span className="text-muted-foreground font-normal">on Solana</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--solana-green)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--solana-green)] animate-pulse" />
                ~1.2s finality
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChainRouting() {
  const chains = [
    { name: "Ethereum", color: "#627EEA" },
    { name: "Polygon", color: "#8247E5" },
    { name: "Bitcoin", color: "#F7931A" },
    { name: "Base", color: "#0052FF" },
  ];
  return (
    <div className="relative">
      <svg viewBox="0 0 320 200" className="w-full h-auto">
        <defs>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
        </defs>
        {chains.map((c, i) => {
          const y = 25 + i * 40;
          return (
            <g key={c.name}>
              <circle cx="30" cy={y} r="6" fill={c.color} />
              <text x="44" y={y + 4} fill="#cfd2dc" fontSize="11" fontFamily="Inter">
                {c.name}
              </text>
              <path
                d={`M70 ${y} C 150 ${y}, 180 100, 270 100`}
                stroke="url(#route)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 6"
                opacity="0.7"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-40"
                  dur={`${1.6 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          );
        })}
        <circle cx="270" cy="100" r="14" fill="#14F195" opacity="0.15" />
        <circle cx="270" cy="100" r="9" fill="#14F195" />
        <text x="270" y="135" textAnchor="middle" fill="#cfd2dc" fontSize="11" fontFamily="Inter">
          SOL · Solana
        </text>
      </svg>
    </div>
  );
}
