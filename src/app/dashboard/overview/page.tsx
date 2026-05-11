"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  X
} from "lucide-react";

const COLORS = ["#00D9FF", "#00F5A0", "#FFD700", "#FF6B6B"];

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

export default function OverviewSection({ auth, merchant }: { auth: any; merchant: any }) {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [successfulTransactions, setSuccessfulTransactions] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cancelledTransactions, setCancelledTransactions] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/check-payment");

        if (!response.ok) {
          throw new Error("Failed to check-payment");
        }

        const transactions = await response.json();
        setTotalTransactions(transactions.data.totalTransactions);
        setPendingTransactions(transactions.data.pendingTransactions);
        setSuccessfulTransactions(transactions.data.successTransactions);
        setTotalRevenue(transactions.data.totalAmount);
        setCancelledTransactions(transactions.data.cancelledTransactions);
        console.log("Fetched transactions:", transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);
  return (
    <div className="w-full h-full p-4 md:p-8 space-y-8 overflow-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">
            {auth?.businessName || merchant?.businessName || "Merchant"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={totalRevenue}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Total Transactions"
          value={totalTransactions}
          icon={<ArrowUpRight className="w-5 h-5" />}
        />
        <MetricCard
          label="Completed Orders"
          value={successfulTransactions}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Pending Orders"
          value={pendingTransactions}
          icon={<ArrowDownRight className="w-5 h-5" />}
        />
        <MetricCard
          label="Cancelled Orders"
          value={cancelledTransactions}
          icon={<X className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-4 md:p-6">
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

        <Card className="p-4 md:p-6">
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
                {revenueByToken.map((_, index) => (
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

      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-2">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <p className="text-xs text-muted-foreground mt-1">Your latest payment activities</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-xs md:text-sm">Transaction ID</TableHead>
                <TableHead className="text-xs md:text-sm">Amount</TableHead>
                <TableHead className="text-xs md:text-sm">Token</TableHead>
                <TableHead className="text-xs md:text-sm">Status</TableHead>
                <TableHead className="text-xs md:text-sm">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-xs md:text-sm text-cyan-400">
                    {tx.id}
                  </TableCell>
                  <TableCell className="font-medium text-xs md:text-sm">{tx.amount}</TableCell>
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
                  <TableCell className="text-muted-foreground text-xs md:text-sm">
                    {tx.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
            <Wallet className="w-10 h-10 text-cyan-400" />
            <div>
              <p className="text-xs text-muted-foreground">Settlement Wallet</p>
              <p className="text-sm font-mono mt-1 truncate">
                {merchant?.walletAddress
                  ? `${merchant.walletAddress.slice(0, 8)}...${merchant.walletAddress.slice(-8)}`
                  : "Not configured"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 text-center md:text-left">
          <div>
            <p className="text-xs text-muted-foreground">Settlement Token</p>
            <p className="text-lg font-semibold mt-2">{merchant?.settlementToken || "USDC"}</p>
          </div>
        </Card>

        <Card className="p-4 md:p-6 text-center md:text-left">
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
    <Card
      className={`p-6 ${highlight === "warning" ? "border-yellow-500/20 bg-yellow-500/5" : ""}`}
    >
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
