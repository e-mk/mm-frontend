"use client"
import { useEffect, useState } from 'react';
import CheckoutButtonStripe from "@/components/checkoutStripe";
import { ProductCard } from '@/components/productCard';
import { PRODUCTS, PRODUCT_TYPE } from '@/costants/costants';
import CheckoutButtonAccept from '@/components/checkoutButtonAccept';
import { Keypair, PublicKey } from "@solana/web3.js";
import walletKeypair from "../../create.json";
import { useSolanaGetProvider } from '@/hooks/useSolanaGetProvider';
import { mintHandle } from '@/utils/mint';
import { useSolana } from '@/hooks/useSolana';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  const [percent, setPercent] = useState<any>(undefined);
  const {
    provider,
    connection,
  } = useSolanaGetProvider();
  const seller = Keypair.fromSecretKey(new Uint8Array(walletKeypair));
  let providerMint: any = {};
  const [mintedProducts, setMintedProducts] = useState({});
  const { initialize, accept } = useSolana({
    mintedProducts,
  });

  const usdc_mint = new PublicKey(
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  );

  const handleBuyClick = (product: any) => {
    setSelectedProduct(product);
    setShowPopup(true);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentRes = selectedProduct.price * +e.target.value / 100;
    setPercent(percentRes);
    setQuantity(e.target.value);
  }

  useEffect(() => {
    (async () => {
      for await (const type of Object.values(PRODUCT_TYPE)) {
        providerMint[type] = await mintHandle({
          connection,
          x_amount: PRODUCTS.find(({ type: productType }) => productType === type)?.price,
          seller,
          type
        });
      }
      setMintedProducts(providerMint)
    })()
  }, [])

  const handleInitializeClick = (type: string, price: number) => {
    initialize(
      seller,
      provider,
      price,
      usdc_mint,
      type,
    )
  }

  // TODO: add price
  const handleAcceptClick = (type: string) => {
    accept({
      provider,
      sellerAccept: seller,
      type,
      connection,
      usdc_mint,
    })
  }

  return (
    <main>
      <div className="container px-5 py-20 text-white mx-auto">
        <div className="flex justify-center flex-wrap mx-4 mb-10 text-center gap-7">
          {PRODUCTS.map((product, index) => {
            return <ProductCard
              data={product}
              key={index}
              onBuyClick={handleBuyClick}
              onInitializeClick={() => handleInitializeClick(product.type, product.price)}
            />
          })}
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Confirm Purchase</h2>
            <p className="text-gray-700">Do you want to buy {selectedProduct.title} for {selectedProduct.price} SOL?</p>
            <input type="number" placeholder='How much percent of product do you want'
              value={quantity}
              onChange={(e) => handleQuantityChange(e)}
              className="border border-gray-300 rounded-md p-2 mt-4 text-black placeholder:text-red-600"
              style={{ width: '100%', textAlign: 'center', }}
            />
            <div className="flex justify-end mt-6">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleClosePopup}>Cancel</button>
              <CheckoutButtonStripe amount={percent ? percent : selectedProduct.price} productId={selectedProduct.id} />
              <CheckoutButtonAccept onAcceptClick={() => handleAcceptClick(selectedProduct.type)} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}