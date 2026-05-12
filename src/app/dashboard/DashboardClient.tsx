"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, CreditCard, BarChart3, Settings, Menu, X } from "lucide-react";
import PaymentFlow from "./payment/PaymentFlow";
import OverviewSection from "./overview/page";
import TransactionsSection from "./transaction/page";
import SettingsSection from "./setting/page";
import { AppShell } from "@/components/app/AppShell";



export function DashboardClient() {
  const [activeSection, setActiveSection] = useState<"overview" | "payment" | "transactions" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (
    <AppShell>
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
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "payment" && <PaymentFlow />}
          {activeSection === "transactions" && <TransactionsSection />}
          {activeSection === "settings" && (
            <SettingsSection />
          )}
        </div>
      </div>
    </div></AppShell>
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




