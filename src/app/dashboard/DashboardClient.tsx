"use client";

import { useEffect, useState } from "react";
import { getMerchant, getAuth } from "@/lib/merchant-store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, LayoutGrid, CreditCard, BarChart3, Settings, Menu, X } from "lucide-react";
import PaymentFlow from "./payment/PaymentFlow";
import OverviewSection from "./overview/page";
import TransactionsSection from "./transaction/page";



export function DashboardClient() {
  const [merchant, setMerchant] = useState<ReturnType<typeof getMerchant> | null>(null);
  const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);
  const [activeSection, setActiveSection] = useState<"overview" | "payment" | "transactions" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMerchant(getMerchant());
    setAuth(getAuth());
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={(section) => {
          setActiveSection(section);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden border-b border-white/10 p-4 flex items-center justify-between bg-background sticky top-0 z-30">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto w-full">
          {activeSection === "overview" && <OverviewSection auth={auth} merchant={merchant} />}
          {activeSection === "payment" && <PaymentFlow />}
          {activeSection === "transactions" && <TransactionsSection />}
          {activeSection === "settings" && <SettingsSection merchant={merchant} />}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeSection, setActiveSection, isOpen }: { activeSection: string; setActiveSection: (section: any) => void; isOpen?: boolean }) {
  const sections = [
    { id: "overview", label: "Overview", icon: <LayoutGrid className="w-5 h-5" /> },
    { id: "payment", label: "Accept Payment", icon: <CreditCard className="w-5 h-5" /> },
    { id: "transactions", label: "Transactions", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`w-64 border-r border-white/10 bg-black/40 p-6 space-y-8 overflow-y-auto fixed md:static inset-y-0 left-0 z-50 transition-transform md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:flex md:flex-col`}
    >
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Manage your payments</p>
      </div>

      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeSection === section.id
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-muted-foreground hover:bg-white/5 border border-transparent"
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}



function SettingsSection({ merchant }: { merchant: any }) {
  return (
    <div className="w-full h-full p-4 md:p-8 overflow-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Settlement Configuration</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Settlement Wallet</p>
              <p className="text-sm font-mono p-3 bg-white/5 rounded-md border border-white/10 break-all">
                {merchant?.walletAddress || "Not configured"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Settlement Token</p>
                <p className="text-sm font-semibold p-3 bg-white/5 rounded-md border border-white/10">
                  {merchant?.settlementToken || "USDC"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Settlement Chain</p>
                <p className="text-sm font-semibold p-3 bg-white/5 rounded-md border border-white/10">
                  {merchant?.settlementChain || "Solana"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// function MetricCard({
//   label,
//   value,
//   change,
//   icon,
//   highlight,
// }: {
//   label: string;
//   value: string;
//   change?: string;
//   icon?: React.ReactNode;
//   highlight?: "warning";
// }) {
//   return (
//     <Card className={`p-6 ${highlight === "warning" ? "border-yellow-500/20 bg-yellow-500/5" : ""}`}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-xs text-muted-foreground font-medium">{label}</p>
//           <p className="text-2xl font-semibold mt-2">{value}</p>
//           {change && <p className="text-xs text-green-400 mt-2">{change}</p>}
//         </div>
//         {icon && <div className="text-muted-foreground">{icon}</div>}
//       </div>
//     </Card>
//   );
// }
