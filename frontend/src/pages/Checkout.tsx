import {loadStripe} from '@stripe/stripe-js';
import { useGetItemsInCart } from '../hooks/useCart';
import { NavBar } from '../components/NavBar';
import CheckoutForm from '../components/CheckoutForm';
import { useEffect, useState } from 'react';
import EmptyCart from '../components/EmptyCart';
import { Elements } from "@stripe/react-stripe-js";
import type { Appearance} from "@stripe/stripe-js";
import { Currency } from '../types/payment';
import { useCurrencyStore } from '../store/currencyStore';
import { useCheckoutCart } from '../hooks/usePayment';

const stripePromise = loadStripe('pk_test_51TgWTnCDwNSYTeMmNEDxD93Dgljk3QCUDiuISDeJsvA3KVooaqSz6ht6uQw1tUbf8QOS43edALoBM2EQozQWbQo300sJA7SfRg');

const appearance: Appearance = {
    inputs: 'spaced',
    labels: 'auto',
    theme: "night",
    variables: {
        colorText: "white",
        colorPrimary: "#456EC3",
        labelColorText: "black",
        colorBackground: "black"
    }
};

export default function CheckoutPage() { // TODO: Add websockets to read status changes from backend to improve UX when cart changes mid checkout  
                                         // TODO: Update the minimum amount in stripe for payments
    const currency = useCurrencyStore((state) => state.currency);
    const currency_symbol = useCurrencyStore((state) => state.symbol)
    const {itemsInCart, isLoading, isError} = useGetItemsInCart(currency)
    const {mutateAsync} = useCheckoutCart()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    
    useEffect(() => {   
        if (!currency) return
        if (clientSecret) return

        async function createCheckout(currency: Currency) {
            const data = await mutateAsync(currency)
            setClientSecret(data.client_secret)
        }
        createCheckout(currency)
    }, [mutateAsync, currency, clientSecret])

    if (isLoading) { return <div>Loading page..</div>}
    if (isError || !itemsInCart) { return null }
    if (!itemsInCart.length) { return <EmptyCart/>}
    if (!clientSecret) return <div>Preparing checkout...</div>

    return (
        <div className="bg-[#EAEDED]">
            <NavBar/>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
            </Elements>
        </div>
    )   
}