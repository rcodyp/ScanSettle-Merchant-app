"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { signUp } from "@/lib/merchant-store";
import Wallet from "../wallet/Wallet";

export function RegisterClient() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !email || password.length < 6) {
      setErr("Fill all fields. Password must be 6+ characters.");
      return;
    }
    signUp(businessName, email, password);
    router.push("/setup");
  };

  return (
    <AppShell>
      <div className="mx-auto mt-8 max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up your merchant profile in under a minute.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Business name">
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="input"
              placeholder="Blue Bottle Coffee"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@business.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </Field>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="w-full rounded-md bg-foreground py-2.5 font-medium text-background hover:opacity-90">
            Create account
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have one?{" "}
            <Link href="/login" className="text-foreground underline">
              Sign in
            </Link>
          </p>
        </form>
        <br />
        <hr />
        <br />
        <Wallet />
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}