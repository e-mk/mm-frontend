import { StaticImageData } from "next/image";

export interface IMint {
  mint: string;
  sellers_token: string;
  buyers_token?: string | undefined;
}
export interface IMints {
  x_mint_19: IMint;
  y_mint_19: IMint;
  z_mint_19: IMint;
}
export enum IMintType {
  x_mint_19 = "x_mint_19",
  y_mint_19 = "y_mint_19",
  z_mint_19 = "z_mint_19",
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  image: StaticImageData;
  type: IMintType;
}
