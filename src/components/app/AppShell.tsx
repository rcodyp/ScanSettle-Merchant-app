import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { getAuth, signOut } from "@/lib/merchant-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getAuth()?.email ?? null);
  }, [location.pathname]);

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
        location.pathname === to
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
          <Link to="/" className="flex items-center gap-2">
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
                  navigate({ to: "/login" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md"
              >
                Sign out
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-foreground text-background px-3 py-1.5 rounded-md font-medium"
              >
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
