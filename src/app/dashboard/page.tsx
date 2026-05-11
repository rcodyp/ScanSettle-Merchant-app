"use client";

import { AppShell } from "@/components/app/AppShell";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardClient />
    </AppShell>
  );
}
