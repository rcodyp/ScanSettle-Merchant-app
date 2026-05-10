"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Enter amount",
    desc: "Merchant types in the sale amount in their local currency. A unique QR is generated instantly.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6M7 17h4"/></svg>
    ),
  },
  {
    n: "02",
    title: "Customer scans & pays",
    desc: "Any wallet, any chain, any token. KIRAPAY routes and bridges seamlessly behind the scenes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>
    ),
  },
  {
    n: "03",
    title: "Receive USDC on Solana",
    desc: "Merchant receives stable, final USDC on Solana — typically in under two seconds.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="How it works"
          title="From scan to settlement in seconds"
          desc="Three steps. No bridges. No spreadsheets. No chain confusion."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-5 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative glass rounded-2xl p-7 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center text-[#0a0a0a]">
                  {s.icon}
                </div>
                <span className="text-xs font-mono text-muted-foreground">{s.n}</span>
              </div>
              <div className="text-lg font-semibold tracking-tight">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
        {title}
      </h2>
      {desc && <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}
