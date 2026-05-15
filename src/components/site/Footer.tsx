import { Logo } from "./Logo";

const cols = [
  { title: "Product", links: ["Features", "Live Demo", "Pricing", "Changelog"] },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "https://github.com/rcodyp/ScanSettle-Merchant-app" },
      { label: "API Reference", href: "https://github.com/rcodyp/ScanSettle-Merchant-app" },
      { label: "GitHub", href: "https://github.com/rcodyp/ScanSettle-Merchant-app", icon: true },
      { label: "Webhooks", href: "https://github.com/rcodyp/ScanSettle-Merchant-app" },
    ],
  },
  { title: "Company", links: ["About", "Contact", "Press kit", "Careers"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "Compliance"] },
];

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
              Cross-chain crypto payments for real-world merchants. One QR code, any wallet, any chain — settled in SOL on Solana.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--solana-green)] animate-pulse" />
              All systems operational
            </div>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://x.com/syscallr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
              >
                <XIcon />
              </a>
              <a
                href="https://github.com/rcodyp/ScanSettle-Merchant-app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{c.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => {
                    const label = typeof l === "string" ? l : l.label;
                    const href = typeof l === "string" ? "#" : l.href;
                    const showIcon = typeof l !== "string" && l.icon;
                    return (
                      <li key={label}>
                        <a
                          href={href}
                          target={showIcon ? "_blank" : undefined}
                          rel={showIcon ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {label}
                          {showIcon && <GitHubIcon />}
                        </a>
                      </li>
                    );
                  })}
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