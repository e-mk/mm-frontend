import { PublicKeyData, PublicKey } from "@solana/web3.js";
import { Program, web3, Idl, BN } from "@project-serum/anchor";
import { showNotification } from "@/utils/showNotification";
import idl from "../../../mm-escrow/target/idl/mm_escrow.json";
import * as anchor from "@coral-xyz/anchor";
import * as splToken from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

export const useSolana = ({ mintedProducts }: { mintedProducts: any }) => {
  const programID = new web3.PublicKey(
    process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID as PublicKeyData
  );
  const buyerWalletPK = useWallet().publicKey!!;

  const initialize = async (
    seller?: any,
    provider?: any,
    price?: any,
    usdc_mint?: any,
    type?: string
  ) => {
    const program = new Program(idl as Idl, programID, provider);

    const { mint = "", sellers_token = "" } = mintedProducts[type!!] ?? {};

    const escrow = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("escrow"),
        seller.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(type as string),
      ],
      programID
    );

    const escrowedXTokens = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("escrow"), escrow[0].toBuffer()],
      programID
    );

    try {
      await program.rpc.initialize(new BN(price), new BN(50), type, {
        accounts: {
          seller: seller.publicKey,
          xMint: mint,
          yMint: usdc_mint,
          sellersXToken: sellers_token,
          escrow: escrow[0],
          escrowedXTokens: escrowedXTokens[0],
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [seller],
      });
      console.log(type, "type2");
    } catch (error) {
      showNotification((error as { message: string }).message, "error");
    }
  };

  const accept = async ({
    provider,
    sellerAccept,
    type,
    connection,
    usdc_mint,
  }: {
    provider?: any;
    sellerAccept?: any;
    type?: any;
    connection?: any;
    usdc_mint?: any;
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

    const { mint = "" } = mintedProducts[type!!] ?? {};

    const buyers_token_init = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      new PublicKey(mint),
      buyerWalletPK
    );

    const buyers_usdc_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      usdc_mint,
      buyerWalletPK
    );

    const sellers_usdc_token = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      sellerAccept,
      usdc_mint,
      sellerAccept.publicKey
    );

    try {
      await program.rpc.accept({
        accounts: {
          escrow: escrowAccept[0],
          escrowedXTokens: escrowedXTokensAccept[0],
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          buyer: buyerWalletPK,
          sellersYTokens: sellers_usdc_token.address,
          buyersXTokens: buyers_token_init.address,
          buyersYTokens: buyers_usdc_token.address,
        },
        signers: [],
      });
    } catch (error) {
      showNotification((error as { message: string }).message, "error");
    }
  };

  return { initialize, accept };
};
