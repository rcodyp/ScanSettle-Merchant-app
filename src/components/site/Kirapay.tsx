import { motion } from "framer-motion";
import { SectionHeader } from "./HowItWorks";

export function Kirapay() {
  return (
    <section id="kirapay" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Infrastructure"
          title="Powered by KIRAPAY"
          desc="KIRAPAY handles routing, bridging, and settlement behind the scenes — so merchants and customers never have to think about chains."
        />

        <div className="mt-14 glass-strong rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-3xl pointer-events-none" />

          <Diagram />

          <div className="grid sm:grid-cols-3 gap-5 mt-10">
            <Stat label="Chains supported" value="20+" />
            <Stat label="Average settlement" value="~1.2s" />
            <Stat label="Settlement asset" value="USDC · SOL" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-gradient-brand">{value}</div>
    </div>
  );
}

function Diagram() {
  const nodes = [
    { id: "wallet", label: "Customer Wallet", sub: "Any chain · any token", x: 60, y: 110 },
    { id: "kira", label: "KIRAPAY Checkout", sub: "Routing · bridging", x: 360, y: 110, brand: true },
    { id: "route", label: "Cross-chain Routing", sub: "Optimal liquidity path", x: 660, y: 110 },
    { id: "merchant", label: "Merchant", sub: "USDC on Solana", x: 960, y: 110, success: true },
  ];
  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox="0 0 1080 240" className="w-full min-w-[760px] h-auto">
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="50%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <path
          d="M170 110 L290 110 M430 110 L590 110 M730 110 L890 110"
          stroke="url(#line)"
          strokeWidth="2"
          strokeDasharray="6 8"
          fill="none"
          filter="url(#glow)"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2s" repeatCount="indefinite" />
        </path>

        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x - 110}
              y={n.y - 38}
              width="220"
              height="76"
              rx="14"
              fill={n.brand ? "rgba(20,241,149,0.06)" : "rgba(255,255,255,0.03)"}
              stroke={n.brand ? "#14F195" : n.success ? "#14F195" : "rgba(255,255,255,0.12)"}
              strokeWidth={n.brand || n.success ? 1.5 : 1}
            />
            <text x={n.x} y={n.y - 6} textAnchor="middle" fill="#fff" fontFamily="Inter" fontSize="14" fontWeight="600">{n.label}</text>
            <text x={n.x} y={n.y + 16} textAnchor="middle" fill="#9aa0ad" fontFamily="Inter" fontSize="11">{n.sub}</text>
          </g>
        ))}
      </svg>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-4 gap-3 mt-6 text-xs text-muted-foreground"
      >
        <Tag>Signature verification</Tag>
        <Tag>Optimal routing</Tag>
        <Tag>Atomic settlement</Tag>
        <Tag>Webhook delivery</Tag>
      </motion.div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg glass px-3 py-2 text-center">{children}</div>
  );
}
