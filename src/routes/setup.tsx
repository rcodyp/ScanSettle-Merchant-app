import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { getAuth, getMerchant, setMerchant } from "@/lib/merchant-store";

const TOKENS = ["USDC", "USDT", "SOL", "ETH"];
const CHAINS = ["Solana", "Ethereum", "Base", "Arbitrum", "Polygon"];

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Merchant setup — ScanSettle" },
      { name: "description", content: "Connect your wallet and configure settlement." },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [settlementToken, setSettlementToken] = useState("USDC");
  const [settlementChain, setSettlementChain] = useState("Solana");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      navigate({ to: "/login" });
      return;
    }
    const m = getMerchant();
    setBusinessName(m?.businessName ?? auth.businessName);
    setEmail(m?.email ?? auth.email);
    setWalletAddress(m?.walletAddress ?? "");
    setSettlementToken(m?.settlementToken ?? "USDC");
    setSettlementChain(m?.settlementChain ?? "Solana");
  }, [navigate]);

  const connect = () => {
    // Mock wallet connect — generate a Solana-like address.
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let addr = "";
    for (let i = 0; i < 44; i++) addr += chars[Math.floor(Math.random() * chars.length)];
    setWalletAddress(addr);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setMerchant({ businessName, email, walletAddress, settlementToken, settlementChain });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Merchant setup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your payout wallet and choose how you want to be settled.
        </p>

        <form onSubmit={save} className="mt-8 space-y-6">
          <Card title="Business">
            <div className="grid sm:grid-cols-2 gap-4">
              <Labeled label="Business name">
                <input
                  className="input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Labeled>
              <Labeled label="Email">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Labeled>
            </div>
          </Card>

          <Card title="Payout wallet">
            <Labeled label="Wallet address">
              <div className="flex gap-2">
                <input
                  className="input flex-1 font-mono text-xs"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Paste wallet address or connect"
                />
                <button
                  type="button"
                  onClick={connect}
                  className="px-4 rounded-md border border-white/15 text-sm hover:bg-white/5"
                >
                  Connect wallet
                </button>
              </div>
            </Labeled>
          </Card>

          <Card title="Settlement preference">
            <p className="text-xs text-muted-foreground mb-3">
              KIRAPAY routes any incoming token/chain into your preferred payout. Default is USDC on
              Solana.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Labeled label="Token">
                <select
                  className="input"
                  value={settlementToken}
                  onChange={(e) => setSettlementToken(e.target.value)}
                >
                  {TOKENS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Labeled>
              <Labeled label="Chain">
                <select
                  className="input"
                  value={settlementChain}
                  onChange={(e) => setSettlementChain(e.target.value)}
                >
                  {CHAINS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Labeled>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <button className="bg-foreground text-background font-medium px-5 py-2.5 rounded-md hover:opacity-90">
              Save profile
            </button>
            {walletAddress && (
              <button
                type="button"
                onClick={() => navigate({ to: "/pos" })}
                className="px-5 py-2.5 rounded-md border border-white/15 text-sm hover:bg-white/5"
              >
                Continue to POS →
              </button>
            )}
            {saved && <span className="text-sm text-emerald-400">Saved</span>}
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-sm font-medium text-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
