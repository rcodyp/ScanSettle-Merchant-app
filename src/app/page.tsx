import type { Metadata } from "next";

import { Footer } from "@/components/site/Footer";
import { Features } from "@/components/site/Features";
import { FinalCta } from "@/components/site/FinalCta";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Kirapay } from "@/components/site/Kirapay";
import { Nav } from "@/components/site/Nav";
import { PosDemo } from "@/components/site/PosDemo";
import { Problem } from "@/components/site/Problem";
import { Trust } from "@/components/site/Trust";

export const metadata: Metadata = {
  title: "ScanSettle — Accept any crypto. Settle in USDC on Solana.",
  description:
    "ScanSettle is a cross-chain crypto POS for physical merchants. Accept payments from any wallet, any token, any chain — and always settle in USDC on Solana.",
  openGraph: {
    title: "ScanSettle — Cross-chain crypto POS for merchants",
    description: "One QR code. Any wallet. Any chain. Settle in USDC on Solana.",
  },
}; 

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased dark">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Problem />
        <Kirapay />
        <PosDemo />
        <Features />
        <Trust />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}