import { mintProduct } from "./mintProduct";

export const mintHandle = async ({
  connection,
  x_amount,
  seller,
  type,
}: any) => {
  const { mint, sellers_token, buyers_token } = await mintProduct({
    type,
    seller,
    connection,
    x_amount,
  });

  return {
    mint,
    sellers_token,
    buyers_token,
  };
};
