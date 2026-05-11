import { SectionHeader } from "./HowItWorks";

const oldWay = [
  "Customer must use the right chain",
  "Wallet incompatibility everywhere",
  "Manual bridging & gas friction",
  "Token allow-lists per merchant",
  "Volatile balances, accounting chaos",
];

const newWay = [
  "Any wallet works out of the box",
  "Any token, any chain accepted",
  "Routing & bridging fully abstracted",
  "Universal acceptance",
  "Always settle in stable SOL on Solana",
];

export function Problem() {
  return (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="The problem"
          title="Crypto payments are still broken for real merchants"
          desc="Every wallet, every chain, every token introduces friction. ScanSettle removes all of it."
        />
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          <Card title="Traditional crypto checkout" tone="muted" items={oldWay} />
          <Card title="With ScanSettle" tone="brand" items={newWay} />
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "muted" | "brand";
}) {
  const isBrand = tone === "brand";
  return (
    <div
      className={`relative rounded-3xl p-8 ${
        isBrand
          ? "glass-strong ring-1 ring-[color-mix(in_oklab,var(--solana-green)_30%,transparent)]"
          : "glass"
      }`}
    >
      {isBrand && (
        <div className="absolute -inset-px rounded-3xl bg-gradient-brand opacity-10 pointer-events-none" />
      )}
      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <span
            className={`h-2 w-2 rounded-full ${
              isBrand ? "bg-[var(--solana-green)]" : "bg-muted-foreground/40"
            }`}
          />
          <div className="text-sm font-medium">{title}</div>
        </div>
        <ul className="space-y-3.5">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-sm">
              {isBrand ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14F195" strokeWidth="2.5" className="mt-0.5 shrink-0"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-muted-foreground/50"><path d="M18 6L6 18M6 6l12 12"/></svg>
              )}
              <span className={isBrand ? "text-foreground" : "text-muted-foreground"}>
                {it}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
