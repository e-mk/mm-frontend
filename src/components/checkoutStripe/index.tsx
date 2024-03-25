import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

const asyncStripe = loadStripe("pk_test_51LUSVbA0dLaAXlIjj4hVqrKJV77njbL9G1sC4ZbqyJqJF9CiX3YqMaBvgQtX192NVDnLmrxvAR9inAdOEKENYsDt009uNikU59");

const CheckoutButtonStripe = ({ amount = 1, productId }: { amount: any, productId: any }) => {
    const router = useRouter();

    const handler = async () => {
        try {
            const stripe: any = await asyncStripe;
            const res = await fetch("/api/stripe/session", {
                method: "POST",
                body: JSON.stringify({
                    amount,
                    id: productId
                }),
                headers: { "Content-Type": "application/json" },
            });
            const { sessionId } = await res.json();

            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                router.push("/error");
            }
        } catch (err) {
            console.log(err);
            router.push("/error");
        }
    };

    return (
        <button
            onClick={handler}
            className="bg-blue-700 hover:bg-blue-800 duration-200 px-8 mx-3 py-4 rounded-lg text-white"
        >
            Buy Stripe
        </button>
    );
};

export default CheckoutButtonStripe;