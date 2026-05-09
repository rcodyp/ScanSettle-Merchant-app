import { SectionHeader } from "./HowItWorks";

const stack = [
  { name: "Next.js 15", role: "App Router · RSC" },
  { name: "KIRAPAY SDK", role: "Cross-chain routing" },
  { name: "Solana", role: "Settlement layer" },
  { name: "Tailwind CSS", role: "UI system" },
  { name: "Vercel", role: "Edge deploy" },
  { name: "QR APIs", role: "Universal payment URI" },
  { name: "Webhooks", role: "Signed event delivery" },
  { name: "TypeScript", role: "End-to-end safety" },
];

export function Developers() {
  return (
    <section id="developers" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Developers"
              title="A modern stack, designed for production"
              desc="Drop ScanSettle into any merchant flow with a few lines of code. Verified webhooks, typed SDKs, and edge-ready performance out of the box."
            />
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stack.map((s) => (
                <div key={s.name} className="rounded-xl glass p-3.5">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.role}</div>
                </div>
              ))}
            </div>
          </div>

          <CodeCard />
        </div>
      </div>
    </section>
  );
}

function CodeCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-brand opacity-15 blur-3xl rounded-3xl pointer-events-none" />
      <div className="relative glass-strong rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">scansettle.ts</span>
        </div>
        <pre className="p-5 text-[12.5px] leading-relaxed font-mono overflow-x-auto">
<code><span className="text-[#9aa0ad]">// Create a charge — settle in USDC on Solana</span>{"\n"}
<span className="text-[#9945FF]">import</span>{" "}<span className="text-foreground">{"{ ScanSettle }"}</span>{" "}
<span className="text-[#9945FF]">from</span> <span className="text-[#14F195]">"@scansettle/sdk"</span>;{"\n\n"}
<span className="text-[#9945FF]">const</span> <span className="text-[#00C2FF]">pos</span> = <span className="text-[#9945FF]">new</span>{" "}
<span className="text-foreground">ScanSettle</span>({"{ apiKey: process.env."}<span className="text-[#14F195]">SS_KEY</span>{" }"});{"\n\n"}
<span className="text-[#9945FF]">const</span> <span className="text-[#00C2FF]">charge</span> ={" "}
<span className="text-[#9945FF]">await</span> <span className="text-[#00C2FF]">pos</span>.<span className="text-foreground">charges</span>.<span className="text-foreground">create</span>({"{"}
{"\n  amount: "}<span className="text-[#14F195]">42.00</span>,
{"\n  currency: "}<span className="text-[#14F195]">"USD"</span>,
{"\n  settle: {"}{" chain: "}<span className="text-[#14F195]">"solana"</span>{", asset: "}<span className="text-[#14F195]">"USDC"</span>{" }"},
{"\n  accept: "}<span className="text-[#14F195]">"any"</span>,{"\n"}{"})"};{"\n\n"}
<span className="text-[#9aa0ad]">// → returns a universal QR + listens for webhooks</span>{"\n"}
<span className="text-foreground">render</span>(<span className="text-[#00C2FF]">charge</span>.qr);
</code>
        </pre>
      </div>
    </div>
  );
}
