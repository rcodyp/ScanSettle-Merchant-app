"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Logo } from "@/components/site/Logo";
import { LayoutGrid, CreditCard, BarChart3, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { connected, connecting } = useWallet();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (connecting) {
    return (
      <div className="min-h-screen bg-background text-foreground antialiased dark flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking wallet connection...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-background text-foreground antialiased dark flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <h1 className="text-xl font-semibold">Connect Wallet to Access Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your dashboard is available only after connecting a Solana wallet.
          </p>
          <div className="mt-5 flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground antialiased dark overflow-hidden">
      <header className="border-b border-white/10 sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === "/" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Home
            </Link>
            <WalletMultiButton />
          </div>
        </div>
      </header>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-20 w-64 border-r border-white/10 bg-black/40 p-6 space-y-8 overflow-y-auto transition-transform md:static md:translate-x-0 md:h-full ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex md:flex-col`}
        >
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your payments</p>
          </div>

          <nav className="space-y-2">
            <DashboardLink href="/dashboard/overview" active={pathname === "/dashboard/overview"} icon={<LayoutGrid className="w-5 h-5" />} label="Overview" />
            <DashboardLink href="/dashboard/payment" active={pathname === "/dashboard/payment"} icon={<CreditCard className="w-5 h-5" />} label="Accept Payment" />
            <DashboardLink href="/dashboard/transaction" active={pathname === "/dashboard/transaction"} icon={<BarChart3 className="w-5 h-5" />} label="Transactions" />
            <DashboardLink href="/dashboard/setting" active={pathname === "/dashboard/setting"} icon={<Settings className="w-5 h-5" />} label="Settings" />
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="md:hidden border-b border-white/10 p-4 flex items-center justify-between bg-background sticky top-0 z-30">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <main className="flex-1 min-h-0 overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

function DashboardLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
        active
          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          : "text-muted-foreground hover:bg-white/5 border border-transparent"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
