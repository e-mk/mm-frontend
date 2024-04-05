import {
  PublicKeyData,
  PublicKey,
  Keypair,
  Connection,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Ed25519Program,
  Transaction,
} from "@solana/web3.js";
import { Program, web3, Idl, BN, AnchorProvider } from "@project-serum/anchor";
import { showNotification } from "@/utils/showNotification";
import idl from "../mm_escrow.json";
import * as anchor from "@coral-xyz/anchor";
import * as splToken from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { USDC_MINT, YPRICE } from "@/costants/costants";
import { IMintType, IMints } from "@/interface/productInterface";
import wallet from "../key.json";
import { intToBytes } from "@/utils/utils";
import { adminKeypair, programID } from "@/pages/utils";
import mintedProducts from "../pages/mint.json";

export const useSolana = ({
  // mintedProducts,
  buyerWalletPK,
}: {
  // mintedProducts: IMints | {};
  buyerWalletPK: PublicKey;
}) => {
  // const initialize = async (
  //   seller: Keypair,
  //   provider?: AnchorProvider,
  //   price?: number,
  //   type?: IMintType
  // ) => {
  //   const program = new Program(idl as Idl, programID, provider);
  //   const { mint = "", sellers_token = "" } =
  //     (mintedProducts as IMints)[type!!] ?? {};

  //   const escrow = anchor.web3.PublicKey.findProgramAddressSync(
  //     [
  //       anchor.utils.bytes.utf8.encode("escrow"),
  //       seller.publicKey.toBuffer(),
  //       anchor.utils.bytes.utf8.encode(type as string),
  //     ],
  //     programID
  //   );

  //   const escrowedXTokens = anchor.web3.PublicKey.findProgramAddressSync(
  //     [anchor.utils.bytes.utf8.encode("escrow"), escrow[0].toBuffer()],
  //     programID
  //   );
  //   const TOKEN_DECIMALS = 1000000;
  //   const xAmount = new anchor.BN((price!! * TOKEN_DECIMALS) / YPRICE);

  //   try {
  //     await program.methods
  //       .initialize(xAmount, new anchor.BN(YPRICE), type)
  //       .accounts({
  //         seller: seller.publicKey,
  //         xMint: mint,
  //         yMint: USDC_MINT,
  //         sellersXToken: sellers_token,
  //         escrow: escrow[0],
  //         escrowedXTokens: escrowedXTokens[0],
  //         tokenProgram: splToken.TOKEN_PROGRAM_ID,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([seller])
  //       .rpc();
  //   } catch (error) {
  //     showNotification((error as { message: string }).message, "error");
  //   }
  // };

  const acceptWallet = async ({
    provider,
    sellerAccept,
    type,
    connection,
    quantity,
  }: {
    provider?: AnchorProvider;
    sellerAccept: Keypair;
    type?: IMintType;
    connection: Connection;
    quantity: string;
  }) => {
    const program = new Program(idl as Idl, programID, provider);

    const escrowAccept = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("escrow"),
        sellerAccept.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(type as string),
      ],
      programID
    );

    const escrowedXTokensAccept = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("escrow"), escrowAccept[0].toBuffer()],
      programID
    );

    const { mintAddress = "" } = (mintedProducts as IMints)[type!!] ?? {};

    const buyers_token_init = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      new PublicKey(mintAddress),
      buyerWalletPK
    );

    const buyers_usdc_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      USDC_MINT,
      buyerWalletPK
    );

    const sellers_usdc_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      USDC_MINT,
      sellerAccept.publicKey
    );
    const xRequested = +quantity * 1000000;
    const yAmount = +xRequested * YPRICE;

    try {
      await program.methods
        .accept(new anchor.BN(xRequested), new anchor.BN(yAmount))
        .accounts({
          escrow: escrowAccept[0],
          escrowedXTokens: escrowedXTokensAccept[0],
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          buyer: buyerWalletPK,
          yMint: USDC_MINT,
          sellersYTokens: sellers_usdc_token.address,
          buyersXTokens: buyers_token_init.address,
          buyersYTokens: buyers_usdc_token.address,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .signers([])
        .rpc();
    } catch (error) {
      showNotification((error as { message: string }).message, "error");
    }
  };

  const acceptStripe = async ({
    provider,
    sellerAccept,
    type,
    connection,
    quantity,
    mintedProductsData,
  }: {
    provider?: AnchorProvider;
    sellerAccept: Keypair;
    type?: IMintType;
    connection: Connection;
    quantity: string;
    mintedProductsData: any;
  }) => {
    const program = new Program(idl as Idl, programID, provider);

    const escrowAcceptStripe = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("escrow"),
        sellerAccept.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(type as string),
      ],
      programID
    );
    const escrowedXTokensAcceptStripe =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("escrow"),
          escrowAcceptStripe[0].toBuffer(),
        ],
        programID
      );

    const { mintAddress = "" } = (mintedProductsData as IMints)[type!!] ?? {};

    const buyers_token_init = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      new PublicKey(mintAddress),
      buyerWalletPK
    );

    const buyers_usdc_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      USDC_MINT,
      buyerWalletPK
    );

    const sellers_usdc_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      USDC_MINT,
      sellerAccept.publicKey
    );

    const xRequested = +quantity * 1000000;
    const yAmount = +xRequested * YPRICE;
    try {
      const message = intToBytes(yAmount);
      const ed25519Ix = Ed25519Program.createInstructionWithPrivateKey({
        privateKey: adminKeypair.secretKey,
        message,
      });

      const acceptIx = await program.methods
        .accept(new anchor.BN(xRequested), new anchor.BN(yAmount))
        .accounts({
          escrow: escrowAcceptStripe[0],
          escrowedXTokens: escrowedXTokensAcceptStripe[0],
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          buyer: buyerWalletPK,
          yMint: USDC_MINT,
          sellersYTokens: sellers_usdc_token.address,
          buyersXTokens: buyers_token_init.address,
          buyersYTokens: buyers_usdc_token.address,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .instruction();

      const tx = new Transaction().add(ed25519Ix, acceptIx);
      await provider
        ?.sendAndConfirm(tx, [])
        // .then(log)
        .catch((e) => console.error(e));
      return true;
    } catch (error) {
      showNotification((error as { message: string }).message, "error");
    }
  };

  return { acceptWallet, acceptStripe };
};
