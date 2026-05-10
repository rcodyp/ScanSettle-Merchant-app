import type { Metadata } from "next";

import { PosClient } from "./PosClient";

export const metadata: Metadata = {
  title: "POS",
  description: "Generate a payment QR for your customer.",
};

export default function PosPage() {
  return <PosClient />;
}