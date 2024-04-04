import mintData from "../pages/mint.json";
import * as splToken from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";

export const mintProduct = async ({
  type,
  seller,
  connection,
  mintAmount,
}: {
  type: string;
  seller: Keypair;
  connection: Connection;
  mintAmount: number | undefined;
}) => {
  const jsonMint: any = mintData;
  const product = (jsonMint ?? {})[type];
  let mint: any = null;
  let sellers_token: any = null;
  let buyers_token: any = null;
  if (product) {
    mint = product.mintAddress;
    sellers_token = product.sellers_token;
    buyers_token = product.buyers_token;
  } else {
    mint = await splToken.createMint(
      connection,
      seller,
      seller.publicKey,
      seller.publicKey,
      6
    );

    sellers_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      seller,
      mint,
      seller.publicKey
    );

    await splToken.mintTo(
      connection,
      seller,
      mint,
      sellers_token.address,
      seller,
      mintAmount!! * 1000000
    );

    await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({
        mint: mint.toString(),
        sellers_token: sellers_token.address.toString(),
        type,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }

  return {
    mint,
    sellers_token,
    buyers_token,
  };
};
