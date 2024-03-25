"use client"
import { useEffect, useState } from 'react';
import CheckoutButtonStripe from "@/components/checkoutStripe";
import CheckoutButtonWallet from '@/components/checkoutWallet';
import { ProductCard } from '@/components/productCard';
import { PRODUCTS } from '@/costants/costants';
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const [currentProducts, setCurrentProducts] = useState(PRODUCTS)
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  const [percent, setPercent] = useState<any>(undefined);

  const searchParams = useSearchParams();
  const searchAmount = searchParams.get('amount');
  const searchId = searchParams.get("id");

  // useEffect(() => {
  //   if (searchAmount && searchId) {
  //     const newProduct = currentProducts.find((el) => el.id === +searchId);

  //     if (newProduct) {
  //       newProduct.price = +searchAmount;
  //       setCurrentProducts(currentProducts)
  //     }
  //   }
  // }, [])


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

  return (
    <main>
      <div className="container px-5 py-20 text-white mx-auto">
        <div className="flex justify-center flex-wrap mx-4 mb-10 text-center gap-7">
          {currentProducts.map((product, index) => {
            return <ProductCard data={product} key={index} onBuyClick={handleBuyClick} />
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
              <CheckoutButtonWallet />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}