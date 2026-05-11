import { Card } from "@/components/ui/card";
import { QrCode, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";

export default function PaymentPage() {
  const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "SGD"];
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [currency, setCurrency] = useState("USD");
  // const [order, setOrder] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef(null);

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCheckoutUrl("");
    setQrDataUrl("");

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });
      const data = await response.json();
      console.log(data.data.url);
      setCheckoutUrl(data.data.url);
      console.log(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-lg font-semibold">Accept Payment</h2>
            <p className="text-xs text-muted-foreground mt-1">Generate QR code to receive crypto</p>
          </div>
        </div>

        <form onSubmit={generate} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="col-span-1">
              <span className="text-xs text-muted-foreground">Currency</span>
              <select
                className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                // disabled={!!order}
              >
                {CURRENCIES.map((currencyOption) => (
                  <option key={currencyOption}>{currencyOption}</option>
                ))}
              </select>
            </label>
            <label className="col-span-2">
              <span className="text-xs text-muted-foreground">Amount</span>
              <input
                className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-2xl font-semibold tracking-tight tabular-nums"
                placeholder="0.00"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                // disabled={!!order}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs text-muted-foreground">
              Label (table number, order ID, etc.)
            </span>
            <input
              className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
              placeholder="Table 4 / Order #1042"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              // disabled={!!order}
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-cyan-500 py-3 font-medium text-background hover:bg-cyan-400 disabled:opacity-50 transition-colors"
          >
            {loading ? "Generating…" : "Generate Payment QR"}
          </button>
        </form>
      </Card>
      <Card>
        <div className="bg-white p-4">
          <QRCode value={checkoutUrl} size={256} />
        </div>
      </Card>
    </div>
  );
}
