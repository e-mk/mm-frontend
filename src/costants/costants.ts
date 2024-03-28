import rolex from "../../public/images/rolex.jpg";

export const PRODUCT_TYPE = {
  X_MINT: "x_mint_1",
  Y_MINT: "y_mint_1",
  Z_MINT: "z_mint_1",
};

export const PRODUCTS = [
  {
    id: 1,
    title: "Rolex",
    price: 8,
    image: rolex,
    type: PRODUCT_TYPE.X_MINT,
  },
  {
    id: 2,
    title: "Rolex",
    price: 15,
    image: rolex,
    type: PRODUCT_TYPE.Y_MINT,
  },
  {
    id: 3,
    title: "Rolex",
    price: 50,
    image: rolex,
    type: PRODUCT_TYPE.Z_MINT,
  },
];
