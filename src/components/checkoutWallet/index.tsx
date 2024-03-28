const CheckoutButtonWallet = ({
    onInitializeClick
}: {
    onInitializeClick: any
}) => {
    return (
        <button
            onClick={onInitializeClick}
            className="bg-blue-700 hover:bg-blue-800 duration-200 px-10 m-3 py-2 rounded-lg text-white"
        >
            Initialize
        </button>
    );
};

export default CheckoutButtonWallet;