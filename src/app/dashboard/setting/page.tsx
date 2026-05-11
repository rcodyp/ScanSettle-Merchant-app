"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { Card } from "../../../components/ui/card";

type Merchant = {
  businessName: string;
  email: string;
  walletAddress: string;
  settlementToken: string;
  settlementChain: string;
};

export default function SettingsSection({
  merchant,
}: {
  merchant: Merchant | null;
}) {
  const { publicKey, connected, wallet } = useWallet();
  const connectedWalletAddress = publicKey?.toBase58() ?? "Not connected";
  const settlementWalletAddress = merchant?.walletAddress || "Not set";
  const walletName = wallet?.adapter.name ?? "Unknown wallet";

  return (
    <div className="flex min-h-full w-full items-center justify-center overflow-auto p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          View the connected wallet and merchant settlement details.
        </p>
        </div>

        <Card className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-lg font-semibold">Wallet Information</h2>
              <p className="text-sm text-muted-foreground">
                This page is read-only and shows the wallet currently connected to the dashboard.
              </p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${connected ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-muted-foreground"}`}>
              {connected ? "Connected" : "Disconnected"}
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-muted-foreground mb-2">Wallet Name</p>
              <p className="text-sm font-semibold break-all">{walletName}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-muted-foreground mb-2">Connected Wallet Address</p>
              <p className="text-sm font-semibold break-all">{connectedWalletAddress}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Wallet Status</p>
                <p className="text-sm font-semibold">
                  {connected ? "Available in this dashboard" : "Wallet not connected"}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Wallet Type</p>
                <p className="text-sm font-semibold">Solana</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Settlement Wallet</p>
                <p className="text-sm font-semibold break-all">{settlementWalletAddress}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Settlement Token</p>
                <p className="text-sm font-semibold">{merchant?.settlementToken || "SOL"}</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-muted-foreground mb-2">Settlement Chain</p>
              <p className="text-sm font-semibold">{merchant?.settlementChain || "Solana"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Business Name</p>
                <p className="text-sm font-semibold">{merchant?.businessName || "Not set"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Email</p>
                <p className="text-sm font-semibold break-all">{merchant?.email || "Not set"}</p>
              </div>
            </div>

            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-muted-foreground">
              To change the wallet, switch the connected wallet in your wallet extension. This page only
              displays the current wallet details.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
