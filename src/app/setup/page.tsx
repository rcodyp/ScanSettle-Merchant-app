import type { Metadata } from "next";

import { SetupClient } from "./SetupClient";

export const metadata: Metadata = {
  title: "Merchant setup",
  description: "Connect your wallet and configure settlement.",
};

export default function SetupPage() {
  return <SetupClient />;
}