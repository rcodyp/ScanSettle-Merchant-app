"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./HowItWorks";

const features = [
  { title: "Cross-chain payments", desc: "Accept from Ethereum, Solana, Base, Polygon, Bitcoin and more.", icon: "M4 12h16M4 6h16M4 18h16" },
  { title: "Non-custodial settlement", desc: "Funds route directly to the merchant's own Solana wallet.", icon: "M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" },
  { title: "Browser-based POS", desc: "No app, no hardware. Works on any phone, tablet or laptop.", icon: "M3 5h18v12H3zM7 21h10M12 17v4" },
  { title: "USDC settlement on Solana", desc: "Sub-second finality, fractions of a cent in fees.", icon: "M12 2v20M5 9h14M5 15h14" },
  { title: "Instant QR generation", desc: "Universal payment QR per charge — works in any wallet.", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3z" },
  { title: "Merchant-friendly UX", desc: "Built for cashiers — designed for speed under real load.", icon: "M3 12l2-2 4 4 8-8 4 4" },
  { title: "Webhook confirmations", desc: "Signed events in real time for ERPs and order systems.", icon: "M4 12a8 8 0 1116 0M8 12a4 4 0 118 0" },
  { title: "Wallet-agnostic checkout", desc: "Phantom, MetaMask, Coinbase, Trust, Rainbow — all welcome.", icon: "M3 7h18v10H3zM3 11h18M7 15h3" },
];

export function Features() {
  return (
    <section id="features" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Features"
          title="Built for the way merchants actually take payments"
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group relative glass rounded-2xl p-6 hover:bg-white/[0.04] transition-colors overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-15 blur-2xl transition-opacity" />
              <div className="relative">
                <div className="h-10 w-10 rounded-lg glass-strong grid place-items-center text-[var(--solana-green)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={f.icon} /></svg>
                </div>
                <div className="mt-4 text-[15px] font-semibold tracking-tight">{f.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
