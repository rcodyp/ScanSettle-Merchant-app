"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { getAuth, getMerchant, setMerchant } from "@/lib/merchant-store";

const TOKENS = ["USDC", "USDT", "SOL", "ETH"];
const CHAINS = ["Solana", "Ethereum", "Base", "Arbitrum", "Polygon"];

export function SetupClient() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [settlementToken, setSettlementToken] = useState("USDC");
  const [settlementChain, setSettlementChain] = useState("Solana");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.push("/login");
      return;
    }
    const merchant = getMerchant();
    setBusinessName(merchant?.businessName ?? auth.businessName);
    setEmail(merchant?.email ?? auth.email);
    setWalletAddress(merchant?.walletAddress ?? "");
    setSettlementToken(merchant?.settlementToken ?? "USDC");
    setSettlementChain(merchant?.settlementChain ?? "Solana");
  }, [router]);

  const connect = () => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let address = "";
    for (let index = 0; index < 44; index += 1) address += chars[Math.floor(Math.random() * chars.length)];
    setWalletAddress(address);
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
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your payout wallet and choose how you want to be settled.
        </p>

        <form onSubmit={save} className="mt-8 space-y-6">
          <Card title="Business">
            <div className="grid gap-4 sm:grid-cols-2">
              <Labeled label="Business name">
                <input className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </Labeled>
              <Labeled label="Email">
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                  className="rounded-md border border-white/15 px-4 text-sm hover:bg-white/5"
                >
                  Connect wallet
                </button>
              </div>
            </Labeled>
          </Card>

          <Card title="Settlement preference">
            <p className="mb-3 text-xs text-muted-foreground">
              KIRAPAY routes any incoming token/chain into your preferred payout. Default is USDC on Solana.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Labeled label="Token">
                <select className="input" value={settlementToken} onChange={(e) => setSettlementToken(e.target.value)}>
                  {TOKENS.map((token) => (
                    <option key={token}>{token}</option>
                  ))}
                </select>
              </Labeled>
              <Labeled label="Chain">
                <select className="input" value={settlementChain} onChange={(e) => setSettlementChain(e.target.value)}>
                  {CHAINS.map((chain) => (
                    <option key={chain}>{chain}</option>
                  ))}
                </select>
              </Labeled>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <button className="rounded-md bg-foreground px-5 py-2.5 font-medium text-background hover:opacity-90">
              Save profile
            </button>
            {walletAddress && (
              <button
                type="button"
                onClick={() => router.push("/pos")}
                className="rounded-md border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5"
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
      <h2 className="mb-4 text-sm font-medium text-foreground">{title}</h2>
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