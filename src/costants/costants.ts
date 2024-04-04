import { PublicKey } from "@solana/web3.js";
import rolex from "../../public/images/rolex.jpg";
import ferrari from "../../public/images/ferrari.jpg";
import yacht from "../../public/images/yacht.jpg";
import { IMintType } from "@/interface/productInterface";

export const USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

export const PRODUCTS = [
  {
    id: 1,
    title: "Rolex",
    price: 5000,
    image: rolex,
    type: IMintType.x_mint_19,
    mintAmount: 1000000,
  },
  {
    id: 2,
    title: "Ferrari",
    price: 200000,
    image: ferrari,
    type: IMintType.y_mint_19,
    mintAmount: 1000000,
  },
  {
    id: 3,
    title: "Yacht",
    price: 500000,
    image: yacht,
    type: IMintType.z_mint_19,
    mintAmount: 1000000,
  },
];

export const YPRICE = 1;
