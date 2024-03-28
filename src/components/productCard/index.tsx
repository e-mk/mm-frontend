import Image from "next/image"
import CheckoutButtonWallet from "../checkoutWallet"

export const ProductCard = ({
    data,
    onBuyClick,
    onInitializeClick,
}: {
    data: any,
    onBuyClick: any,
    onInitializeClick: any
}) => {
    return (
        <div className="mb-10 p-4 border border-[#28DBD1] bg-[#09202F] rounded-lg ">
            <div className="rounded-lg h-64 overflow-hidden">
                <Image alt="content" className="object-cover object-center h-full w-full" src={data.image} />
            </div>
            <h2 className="text-2xl font-medium text-white mt-6 mb-3">
                {data.title}
            </h2>
            <p className="leading-relaxed text-base">{`Price ${data.price} SOL`}</p>
            <button onClick={() => onBuyClick(data)} className="bg-blue-700 hover:bg-blue-800 duration-200 px-10 m-3 py-2 rounded-lg text-white">Buy</button>
            <CheckoutButtonWallet onInitializeClick={onInitializeClick} />
        </div>
    )
}
