import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { web3, AnchorProvider } from "@project-serum/anchor";
import { Cluster, Connection } from "@solana/web3.js";

interface SolanaProviderData {
  provider: AnchorProvider;
  connection: Connection;
}

export const useSolanaGetProvider = (): SolanaProviderData => {
  const buyerWallet = useWallet();
  const opts = {
    preflightCommitment: "processed" as "processed",
  };
  const connection = new web3.Connection(
    web3.clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA as Cluster),
    "confirmed"
  );

  const provider = new AnchorProvider(
    connection,
    buyerWallet as unknown as AnchorWallet,
    opts
  );

  return {
    provider,
    connection,
  };
};
