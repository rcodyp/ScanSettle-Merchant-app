// Browser-only mock auth + merchant profile via localStorage.
export type Merchant = {
  businessName: string;
  email: string;
  walletAddress: string;
  settlementToken: string;
  settlementChain: string;
};

const KEY_AUTH = "scansettle:auth";
const KEY_MERCHANT = "scansettle:merchant";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function signUp(businessName: string, email: string, _password: string) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_AUTH, JSON.stringify({ email, businessName }));
  const existing = getMerchant();
  setMerchant({
    businessName,
    email,
    walletAddress: existing?.walletAddress ?? "",
    settlementToken: existing?.settlementToken ?? "USDC",
    settlementChain: existing?.settlementChain ?? "Solana",
  });
}

export function signIn(email: string, _password: string) {
  if (!isBrowser()) return;
  const m = getMerchant();
  localStorage.setItem(
    KEY_AUTH,
    JSON.stringify({ email, businessName: m?.businessName ?? "Merchant" }),
  );
}

export function signOut() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY_AUTH);
}

export function getAuth(): { email: string; businessName: string } | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(KEY_AUTH);
  return raw ? JSON.parse(raw) : null;
}

export function getMerchant(): Merchant | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(KEY_MERCHANT);
  return raw ? JSON.parse(raw) : null;
}

export function setMerchant(m: Merchant) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_MERCHANT, JSON.stringify(m));
}
