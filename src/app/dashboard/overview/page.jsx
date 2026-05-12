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
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, X } from "lucide-react";
import { useRouter } from "next/navigation";




export default function OverviewSection() {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [successfulTransactions, setSuccessfulTransactions] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cancelledTransactions, setCancelledTransactions] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  const router = useRouter();

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

        const Sales = await fetch(`/api/sales-trends`, {
          method: "GET",
        });
        if (!Sales.ok) {
          throw new Error("Failed to fetch sales trend");
        }
        const salesData = await Sales.json();
        setChartData(
          salesData.data.result.map((item) => ({
            date: item.label,
            sales: item.totalPrice,
          })),
        );
        console.log("Fetched sales trend:", salesData);

        const recentTransReport = await fetch(`/api/transactions?page=1&limit=10`, {
          method: "GET",
        });
        if (!recentTransReport.ok) {
          throw new Error("Failed to fetch recent transactions");
        }
        const recentTransData = await recentTransReport.json();
        console.log("Fetched recent transactions:", recentTransData);

        setRecentTransactions(recentTransData.data?.transactions ?? []);
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
            Merchant
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

      <div className="grid grid-cols-1 gap-6 ">
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
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                }}
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
      </div>

      <Card className="p-4 md:p-6" onClick={() => router.push("/dashboard/transaction")}>
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
                <TableRow key={tx._id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-xs md:text-sm text-cyan-400">
                    {tx._id}
                  </TableCell>
                  <TableCell className="font-medium text-xs md:text-sm">
                    {tx.tokenIn.amount}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded-md bg-white/10 text-xs font-medium">
                      {tx.tokenIn.symbol}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        tx.status === "Success"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs md:text-sm">
                    {new Date(tx.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-4 md:p-6" onClick={()=> router.push("/dashboard/setting")}>
          <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
            <Wallet className="w-10 h-10 text-cyan-400" />
            <div>
              <p className="text-xs text-muted-foreground">Settlement Wallet</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 text-center md:text-left" onClick={()=> router.push("/dashboard/setting")}>
          <div>
            <p className="text-xs text-muted-foreground">Settlement Token</p>
            <p className="text-lg font-semibold mt-2">{"SOL"}</p>
          </div>
        </Card>

        <Card className="p-4 md:p-6 text-center md:text-left" onClick={()=> router.push("/dashboard/setting")}>
          <div>
            <p className="text-xs text-muted-foreground">Settlement Chain</p>
            <p className="text-lg font-semibold mt-2">{"Solana"}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon, highlight }) {
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
