import type { NextApiRequest, NextApiResponse } from "next";
import { writeFileSync, readFileSync } from "fs";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { adminKeypair, connection } from "../utils";
const path = process.cwd() + "/src/pages/mint.json";

export default async  function handler(req: NextApiRequest, res: NextApiResponse) {
  const { 
    price,
    type,
    mintAmount 
  } = req.body;


  const mintAddress = await createMint(
    connection,
    adminKeypair,
    adminKeypair.publicKey,
    adminKeypair.publicKey,
    6
  );

  const associatedTokenAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    adminKeypair,
    mintAddress,
    adminKeypair.publicKey
  );

  const signature = await mintTo(
    connection,
    adminKeypair,
    mintAddress,
    associatedTokenAddress.address,
    adminKeypair,
    mintAmount!! * 1000000
  );

  if(signature) {
    const data = readFileSync(path, "utf8");
    if (!data) {
      res.status(500).json({ error: 'failedd to write file' });
      return;
    }
    const parsedData = JSON.parse(data);
    parsedData[type] = {
      mintAddress: mintAddress.toString(),
      associatedTokenAddress: associatedTokenAddress.address,
      price,
    };
  
    try {
      writeFileSync(path, JSON.stringify(parsedData, null, 2), "utf8");
    } catch (error) {
      res.status(500).json({ error })
      console.log("An error has occurred ", error);
    }
  } else {
    res.status(500).json({ signature })
  }

  res.status(200).json({ done: true });
}
