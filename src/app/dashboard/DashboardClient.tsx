"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { getMerchant, getAuth } from "@/lib/merchant-store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, QrCode, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import PaymentPage from "./payment/page";

type Order = {
  id: string;
  amount: number;
  currency: string;
  label?: string;
  status: "pending" | "paid";
  paidAt?: number;
  txHash?: string;
  settlementToken: string;
  settlementChain: string;
};

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "SGD"];

export function DashboardClient() {
  const [merchant, setMerchant] = useState<ReturnType<typeof getMerchant> | null>(null);
  const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [label, setLabel] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    setMerchant(getMerchant());
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    if (!checkoutUrl) return;
    QRCode.toDataURL(checkoutUrl, {
      margin: 1,
      width: 360,
      color: { dark: "#0b0f17", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [checkoutUrl]);

  useEffect(() => {
    if (!order || order.status === "paid") {
      if (pollRef.current) window.clearInterval(pollRef.current);
      return;
    }
    pollRef.current = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?orderId=${order.id}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.order?.status === "paid") {
          setOrder((current) => (current ? { ...current, ...data.order } : current));
        }
      } catch {
        // Ignore polling errors
      }
    }, 3000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [order]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amountValue = Number(amount);
    if (!amountValue || amountValue <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!merchant) return;
    setLoading(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountValue,
          currency,
          label,
          merchantWallet: merchant.walletAddress,
          settlementToken: merchant.settlementToken,
          settlementChain: merchant.settlementChain,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");
      setOrder(data.order);
      setCheckoutUrl(data.checkoutUrl);
    } catch (problem) {
      setError((problem as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrder(null);
    setCheckoutUrl("");
    setQrDataUrl("");
    setAmount("");
    setLabel("");
    setError("");
  };

  const copyToClipboard = () => {
    if (checkoutUrl) {
      navigator.clipboard.writeText(checkoutUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const chartData = [
    { date: "Jan 1", sales: 4000, orders: 24 },
    { date: "Jan 2", sales: 3000, orders: 18 },
    { date: "Jan 3", sales: 2000, orders: 14 },
    { date: "Jan 4", sales: 2780, orders: 16 },
    { date: "Jan 5", sales: 1890, orders: 11 },
    { date: "Jan 6", sales: 2390, orders: 15 },
    { date: "Jan 7", sales: 3490, orders: 21 },
  ];

  const revenueByToken = [
    { name: "USDC", value: 6500 },
    { name: "SOL", value: 3200 },
    { name: "USDT", value: 2100 },
    { name: "Other", value: 650 },
  ];

  const recentTransactions = [
    { id: "ss_xyz123", amount: "$250.00", token: "USDC", status: "Completed", time: "2 min ago" },
    { id: "ss_abc456", amount: "$125.50", token: "SOL", status: "Completed", time: "15 min ago" },
    { id: "ss_def789", amount: "$89.99", token: "USDC", status: "Completed", time: "45 min ago" },
    { id: "ss_ghi012", amount: "$350.00", token: "USDT", status: "Pending", time: "1 hour ago" },
    { id: "ss_jkl345", amount: "$199.99", token: "USDC", status: "Completed", time: "2 hours ago" },
  ];

  const COLORS = ["#00D9FF", "#00F5A0", "#FFD700", "#FF6B6B"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="font-medium">{auth?.businessName || merchant?.businessName || "Merchant"}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value="$12,450.50"
          change="+12.5%"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Today's Revenue"
          value="$2,150.00"
          change="+8.2%"
          icon={<ArrowUpRight className="w-5 h-5" />}
        />
        <MetricCard
          label="Completed Orders"
          value="156"
          change="+24 this week"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Pending Orders"
          value={order ? "1" : "0"}
          highlight={order ? "warning" : undefined}
          icon={<ArrowDownRight className="w-5 h-5" />}
        />
      </div>

      <PaymentPage />

      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                  disabled={!!order}
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
                  disabled={!!order}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs text-muted-foreground">Label (table number, order ID, etc.)</span>
              <input
                className="input mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                placeholder="Table 4 / Order #1042"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={!!order}
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {!order ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-cyan-500 py-3 font-medium text-background hover:bg-cyan-400 disabled:opacity-50 transition-colors"
              >
                {loading ? "Generating…" : "Generate Payment QR"}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="w-full rounded-md border border-white/15 py-3 hover:bg-white/5 transition-colors"
              >
                Create New Payment
              </button>
            )}
          </form>

          {order && (
            <div className="mt-6 space-y-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
              <Row k="Order ID" v={<span className="font-mono text-xs">{order.id}</span>} />
              <Row k="Amount" v={`${order.amount.toFixed(2)} ${order.currency}`} />
              {order.label && <Row k="Label" v={order.label} />}
              <Row k="Status" v={<span className={order.status === "paid" ? "text-green-400" : "text-yellow-400"}>{order.status === "paid" ? "✓ Paid" : "⏳ Pending"}</span>} />
            </div>
          )}
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center min-h-96">
          {!order ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="mb-3 h-20 w-20 rounded-xl border-2 border-dashed border-white/15 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-sm">Enter an amount to generate a QR code</p>
            </div>
          ) : order.status === "paid" ? (
            <div className="space-y-4 text-center w-full">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-2xl text-emerald-400">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Payment Received</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {order.amount.toFixed(2)} {order.currency} has been settled.
                </p>
              </div>
              {order.txHash && <p className="break-all text-xs text-muted-foreground">TX: {order.txHash}</p>}
            </div>
          ) : (
            <div className="text-center w-full">
              <div className="inline-block rounded-xl bg-white p-4 mb-4">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Payment QR" className="block h-[240px] w-[240px]" />
                ) : (
                  <p className="w-[240px] h-[240px] flex items-center justify-center text-sm text-muted-foreground">Loading QR…</p>
                )}
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-md border border-white/15 py-2 px-3 text-sm hover:bg-white/5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          )}
        </Card>
      </div> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Sales Trend</h2>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days performance</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#00D9FF"
                strokeWidth={2}
                dot={false}
                name="Sales ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Revenue by Token</h2>
            <p className="text-xs text-muted-foreground mt-1">Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByToken}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {revenueByToken.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {revenueByToken.map((token, i) => (
              <div key={token.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{token.name}</span>
                </div>
                <span className="font-medium">${token.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <p className="text-xs text-muted-foreground mt-1">Your latest payment activities</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-sm text-cyan-400">{tx.id}</TableCell>
                  <TableCell className="font-medium">{tx.amount}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded-md bg-white/10 text-xs font-medium">
                      {tx.token}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        tx.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tx.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Wallet className="w-10 h-10 text-cyan-400" />
            <div>
              <p className="text-xs text-muted-foreground">Settlement Wallet</p>
              <p className="text-sm font-mono mt-1 truncate">
                {merchant?.walletAddress ? `${merchant.walletAddress.slice(0, 8)}...${merchant.walletAddress.slice(-8)}` : "Not configured"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-xs text-muted-foreground">Settlement Token</p>
            <p className="text-lg font-semibold mt-2">{merchant?.settlementToken || "USDC"}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-xs text-muted-foreground">Settlement Chain</p>
            <p className="text-lg font-semibold mt-2">{merchant?.settlementChain || "Solana"}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
  highlight?: "warning";
}) {
  return (
    <Card className={`p-6 ${highlight === "warning" ? "border-yellow-500/20 bg-yellow-500/5" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
          {change && <p className="text-xs text-green-400 mt-2">{change}</p>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="break-all text-right text-foreground">{v}</span>
    </div>
  );
}

const chartData = [
  { date: "Jan 1", sales: 4000, orders: 24 },
  { date: "Jan 2", sales: 3000, orders: 18 },
  { date: "Jan 3", sales: 2000, orders: 14 },
  { date: "Jan 4", sales: 2780, orders: 16 },
  { date: "Jan 5", sales: 1890, orders: 11 },
  { date: "Jan 6", sales: 2390, orders: 15 },
  { date: "Jan 7", sales: 3490, orders: 21 },
];

const revenueByToken = [
  { name: "USDC", value: 6500 },
  { name: "SOL", value: 3200 },
  { name: "USDT", value: 2100 },
  { name: "Other", value: 650 },
];

const recentTransactions = [
  { id: "ss_xyz123", amount: "$250.00", token: "USDC", status: "Completed", time: "2 min ago" },
  { id: "ss_abc456", amount: "$125.50", token: "SOL", status: "Completed", time: "15 min ago" },
  { id: "ss_def789", amount: "$89.99", token: "USDC", status: "Completed", time: "45 min ago" },
  { id: "ss_ghi012", amount: "$350.00", token: "USDT", status: "Pending", time: "1 hour ago" },
  { id: "ss_jkl345", amount: "$199.99", token: "USDC", status: "Completed", time: "2 hours ago" },
];

const COLORS = ["#00D9FF", "#00F5A0", "#FFD700", "#FF6B6B"];
