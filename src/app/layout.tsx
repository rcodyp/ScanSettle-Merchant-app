import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../styles.css";
import { SolanaProvider } from "./wallet/SolanaProvider";
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata: Metadata = {
  title: {
    default: "ScanSettle",
    template: "%s — ScanSettle",
  },
  description: "Cross-chain crypto checkout terminal for physical merchants.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "ScanSettle",
    description: "Accept any crypto. Settle in SOL on Solana.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@ScanSettle",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="dark">
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}