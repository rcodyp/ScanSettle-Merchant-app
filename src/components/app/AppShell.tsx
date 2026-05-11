"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function AppShell({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();


  const link = (to: string, label: string) => (
    <Link
      href={to}
      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
        pathname === to
          ? "bg-white/10 text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased dark">
      <header className="border-b border-white/10 sticky top-0 z-30 bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <WalletMultiButton />
        </div>
      </header>
      <main className="max-w mx-auto px-0 py-0">{children}</main>
    </div>
  );
}
