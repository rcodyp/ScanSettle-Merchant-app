"use client";

import { Card } from "@/components/ui/card";
import { QrCode, ArrowLeft, Copy, Check } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import QRCode from "react-qr-code";

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "SGD"];

export default function PaymentFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<"pending" | "paid">("pending");

  useEffect(() => {
    if (status === "paid") {
      const timer = setTimeout(() => {
        // Auto-advance after 3 seconds if needed
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const generate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, label }),
      });
      const data = await response.json();
      const url = data.data?.url || data.url;

      if (!url) {
        throw new Error("No payment URL returned");
      }

      setCheckoutUrl(url);
      setOrderId(data.data?.id || "ORD-" + Date.now());
      setStep(2);
    } catch (err) {
      setError((err as Error).message || "Failed to generate payment");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(checkoutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToStep3 = () => {
    setStatus("pending");
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setAmount("");
    setLabel("");
    setCurrency("USD");
    setCheckoutUrl("");
    setOrderId("");
    setError("");
    setStatus("pending");
  };

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-auto">
      {/* Step 1: Enter Details */}
      {step === 1 && (
        <div className="w-full">
          <Card className="p-6 md:p-8 w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold">
                Step 1
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Enter Payment Details</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Fill in payment information</p>
              </div>
            </div>

            <form onSubmit={generate} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <label className="col-span-1">
                  <span className="text-xs text-muted-foreground">Currency</span>
                  <select
                    className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr}>{curr}</option>
                    ))}
                  </select>
                </label>
                <label className="col-span-2">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <input
                    className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-2xl font-semibold tracking-tight tabular-nums focus:border-cyan-400 focus:outline-none"
                    placeholder="0.00"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs text-muted-foreground">Label (optional)</span>
                <input
                  className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                  placeholder="Table 4 / Order #1042"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </label>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-cyan-500 py-3 font-medium text-background hover:bg-cyan-400 disabled:opacity-50 transition-colors mt-6"
              >
                {loading ? "Generating…" : "Generate Payment QR →"}
              </button>
            </form>
          </Card>
        </div>
      )}

      {/* Step 2: Show QR Code */}
      {step === 2 && (
        <div className="w-full">
          <Card className="p-6 md:p-8 w-full">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold">
                Step 2
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Share QR Code</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Customer scans to pay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <p className="text-2xl font-semibold">
                    {amount} <span className="text-base text-muted-foreground">{currency}</span>
                  </p>
                </div>

                {label && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-muted-foreground mb-1">Label</p>
                    <p className="text-sm">{label}</p>
                  </div>
                )}

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono text-xs text-cyan-400 break-all">{orderId}</p>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 py-3 px-4 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Payment Link
                    </>
                  )}
                </button>

                <button
                  onClick={goToStep3}
                  className="w-full rounded-md bg-cyan-500 py-3 font-medium text-background hover:bg-cyan-400 transition-colors"
                >
                  Check Status →
                </button>
              </div>

              {/* Right: QR Code */}
              <div className="lg:col-span-1 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg">
                  <QRCode value={checkoutUrl} size={220} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step 3: Payment Status */}
      {step === 3 && (
        <div className="w-full">
          <Card className="p-6 md:p-8 w-full">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setStep(2)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold">
                Step 3
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Payment Status</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Order tracking</p>
              </div>
            </div>

            <div className="text-center space-y-6">
              {status === "pending" ? (
                <>
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl text-yellow-400">⏳</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Payment Pending</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Waiting for payment confirmation...
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400 inline-block">
                    {amount} {currency} • Order {orderId}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="text-4xl text-green-400">✓</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-400">Payment Received</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {amount} {currency} has been successfully settled
                    </p>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 inline-block">
                    Order {orderId} • Confirmed
                  </div>
                </>
              )}

              <button
                onClick={reset}
                className="w-full rounded-md bg-cyan-500 py-3 font-medium text-background hover:bg-cyan-400 transition-colors"
              >
                Create New Payment
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
