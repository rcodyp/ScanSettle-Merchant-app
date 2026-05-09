import { SectionHeader } from "./HowItWorks";

const items = [
  { title: "Non-custodial architecture", desc: "ScanSettle never touches merchant funds. Settlement is direct, on-chain, and verifiable." },
  { title: "Merchant-controlled wallets", desc: "Use your own Solana wallet — multisig, hardware, or custody provider of choice." },
  { title: "Secure checkout flow", desc: "Signed payment intents prevent tampering between QR and settlement." },
  { title: "Webhook verification", desc: "Every event is signed with HMAC + timestamp to defeat replay attacks." },
  { title: "Audit-ready logs", desc: "Immutable on-chain trail plus structured exports for accounting." },
  { title: "Scalable infrastructure", desc: "Edge-deployed, horizontally scalable, built for global merchant load." },
];

export function Trust() {
  return (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              align="left"
              eyebrow="Trust & security"
              title="Enterprise-grade by default"
              desc="ScanSettle is built like infrastructure should be — secure, transparent, and merchant-first."
            />
            <Shield />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {items.map((it) => (
              <div key={it.title} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg glass-strong grid place-items-center text-[var(--solana-green)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/></svg>
                  </div>
                  <div className="font-medium text-sm">{it.title}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Shield() {
  return (
    <div className="mt-8 relative h-48">
      <div className="absolute inset-0 grid place-items-center">
        <div className="absolute h-40 w-40 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
          <defs>
            <linearGradient id="sh" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#14F195" />
              <stop offset="100%" stopColor="#9945FF" />
            </linearGradient>
          </defs>
          <path d="M60 6l50 22v36c0 32-22 56-50 64-28-8-50-32-50-64V28L60 6z" stroke="url(#sh)" strokeWidth="1.5" fill="rgba(20,241,149,0.04)"/>
          <path d="M40 70l14 14 28-28" stroke="url(#sh)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
