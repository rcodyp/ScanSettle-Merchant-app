import { Logo } from "./Logo";

const cols = [
  { title: "Product", links: ["Features", "Live Demo", "Pricing", "Changelog"] },
  { title: "Developers", links: ["Docs", "API Reference", "GitHub", "Webhooks"] },
  { title: "Company", links: ["About", "Contact", "Press kit", "Careers"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "Compliance"] },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-[1.4fr_2fr] gap-12">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="font-semibold tracking-tight">ScanSettle</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Cross-chain crypto payments for real-world merchants. One QR code, any wallet, any chain — settled in USDC on Solana.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--solana-green)] animate-pulse" />
              All systems operational
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{c.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} ScanSettle Labs, Inc.</div>
          <div className="flex items-center gap-4">
            <span>Built on Solana</span>
            <span>·</span>
            <span>Powered by KIRAPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
