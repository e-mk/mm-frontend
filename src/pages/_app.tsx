import Header from "@/components/header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ReactNode } from "react";

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import("../components/SolanaWallet/SolanaWallet").then(
      ({ SolanaWallet }) => SolanaWallet
    ),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <Header />
      <Component {...pageProps} />
    </WalletConnectionProvider>
  );
}
