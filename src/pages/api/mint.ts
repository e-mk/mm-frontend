// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { writeFileSync, readFileSync } from "fs";
// const path = join("../../utils/mint.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mint, sellers_token, type } = req.body;
  const path = process.cwd() + "/src/pages/mint.json";

  const data = readFileSync(path, "utf8");
  if (!data) {
    res.status(500).json({ err: true });
    return;
  }
  const parsedData = JSON.parse(data);
  parsedData[type] = {
    mintAddress: mint,
    sellers_token: sellers_token,
  };

  try {
    writeFileSync(path, JSON.stringify(parsedData, null, 2), "utf8");
    console.log("Data successfully saved to disk");
  } catch (error) {
    console.log("An error has occurred ", error);
  }
  res.status(200).json({ done: true });
}
