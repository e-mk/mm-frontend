import { IMintType } from "@/interface/productInterface";
import { mintProduct } from "./mintProduct";
import { Connection, Keypair } from "@solana/web3.js";

export const mintHandle = async ({
  connection,
  seller,
  type,
  mintAmount,
}: {
  connection: Connection;
  seller: Keypair;
  type: IMintType;
  mintAmount: number | undefined;
}) => {
  const { mint, sellers_token, buyers_token } = await mintProduct({
    type,
    seller,
    connection,
    mintAmount,
  });

  return {
    mint,
    sellers_token,
    buyers_token,
  };
};
