import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Problem } from "@/components/site/Problem";
import { Kirapay } from "@/components/site/Kirapay";
import { PosDemo } from "@/components/site/PosDemo";
import { Features } from "@/components/site/Features";
import { Developers } from "@/components/site/Developers";
import { Trust } from "@/components/site/Trust";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScanSettle — Accept any crypto. Settle in USDC on Solana." },
      {
        name: "description",
        content:
          "ScanSettle is a cross-chain crypto POS for physical merchants. Accept payments from any wallet, any token, any chain — and always settle in USDC on Solana.",
      },
      { property: "og:title", content: "ScanSettle — Cross-chain crypto POS for merchants" },
      { property: "og:description", content: "One QR code. Any wallet. Any chain. Settle in USDC on Solana." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden dark">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Problem />
        <Kirapay />
        <PosDemo />
        <Features />
        <Developers />
        <Trust />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
