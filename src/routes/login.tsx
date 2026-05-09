import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { getMerchant, signIn } from "@/lib/merchant-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ScanSettle" },
      { name: "description", content: "Sign in to your merchant account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErr("Enter your email and password.");
      return;
    }
    signIn(email, password);
    const m = getMerchant();
    navigate({ to: m?.walletAddress ? "/pos" : "/setup" });
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Sign in to your merchant POS.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-1.5"
            />
          </label>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="w-full bg-foreground text-background font-medium py-2.5 rounded-md hover:opacity-90">
            Sign in
          </button>
          <p className="text-sm text-muted-foreground text-center">
            New here?{" "}
            <Link to="/register" className="text-foreground underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AppShell>
  );
}
