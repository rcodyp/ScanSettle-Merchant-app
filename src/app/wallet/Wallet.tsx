"use client";

import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SolanaProvider } from "./SolanaProvider";

export default function Wallet() {
  const network = WalletAdapterNetwork.Devnet;
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  return (
    <div>
      <p className="text-center font-medium text-foreground">OR</p>
      <p className="mt-1 text-center text-muted-foreground">
        Continue with your Solana wallet. No sign-up required. We never store your wallet info.
      </p>
      <div className="w-full flex justify-center mt-4">
        <SolanaProvider wallets={wallets}>
          <WalletMultiButton className="flex justify-center items-center" />
        </SolanaProvider>
      </div>
    </div>
  );
}