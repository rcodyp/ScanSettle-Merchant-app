"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { getAuth, signOut } from "@/lib/merchant-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getAuth()?.email ?? null);
  }, [pathname]);

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
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          {email ? (
            <nav className="flex items-center gap-1">
              {link("/pos", "POS")}
              {link("/setup", "Settings")}
              <span className="hidden sm:inline text-xs text-muted-foreground ml-3 mr-2">
                {email}
              </span>
              <button
                onClick={() => {
                  signOut();
                  router.push("/login");
                }}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md"
              >
                Sign out
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">
                Sign in
              </Link>
              <Link href="/register" className="text-sm bg-foreground text-background px-3 py-1.5 rounded-md font-medium">
                Get started
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
