import mintData from "../pages/mint.json";
import * as splToken from "@solana/spl-token";

export const mintProduct = async ({
  type,
  seller,
  connection,
  x_amount,
}: {
  type: string;
  seller: any;
  connection: any;
  x_amount: any;
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
      1
    );

    sellers_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      seller,
      mint,
      seller.publicKey
    );

    // mint_x_token_seller
    await splToken.mintTo(
      connection,
      seller,
      mint,
      sellers_token.address,
      seller,
      x_amount
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
