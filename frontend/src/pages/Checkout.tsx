import {loadStripe} from '@stripe/stripe-js';
import { useCheckoutCart, useGetItemsInCart } from '../hooks/useCart';
import { NavBar } from '../components/NavBar';
import CheckoutForm from '../components/CheckoutForm';
import { useEffect, useState } from 'react';
import EmptyCart from '../components/EmptyCart';
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51TgWTnCDwNSYTeMmNEDxD93Dgljk3QCUDiuISDeJsvA3KVooaqSz6ht6uQw1tUbf8QOS43edALoBM2EQozQWbQo300sJA7SfRg');

export default function CheckoutPage() { // TODO: Add websockets to read status changes from backend to improve UX when cart changes mid checkout  
    const {itemsInCart, isLoading, isError} = useGetItemsInCart()
    const {mutateAsync} = useCheckoutCart()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    
    const cart_id = itemsInCart?.[0]?.cart_id
    useEffect(() => {   
        if (!cart_id) return
        if (clientSecret) return

        async function createCheckout(cartId: number) {
            const data = await mutateAsync(cartId)
            setClientSecret(data.client_secret)
        }
        createCheckout(cart_id)
    }, [mutateAsync, cart_id, clientSecret])

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