"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { getMerchant, signIn } from "@/lib/merchant-store";

export function LoginClient() {
  const router = useRouter();
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
    const merchant = getMerchant();
    router.push(merchant?.walletAddress ? "/pos" : "/setup");
  };

  return (
    <AppShell>
      <div className="mx-auto mt-8 max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back. Sign in to your merchant POS.</p>
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
          <button className="w-full rounded-md bg-foreground py-2.5 font-medium text-background hover:opacity-90">
            Sign in
          </button>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/register" className="text-foreground underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AppShell>
  );
}