import { api } from "../utils/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToCart, ItemInCart, RemoveFromCart } from "../types/cart";
import { Currency, PaymentIntent } from "../types/payment";
import axios from "axios";

export function useGetItemsInCart(currency: Currency) {
    const { data: itemsInCart, isLoading, isError} = useQuery<ItemInCart[]>({
        queryKey: ['itemsInCart', currency],
        queryFn: async () => {
            const res = await api.get('/cart/items', {
                params: {currency}
            })
            return res.data
        },
        })
        
    return {itemsInCart, isLoading, isError}
}

export function useAddToCart() {
    const queryClient = useQueryClient()
    const addToCartMutation = useMutation({
        mutationFn: async (itemToAdd: AddToCart) => {
        await api.post("/cart/add", itemToAdd)

        },
        onSuccess: () => {
            console.log(`Added to cart!`)
            queryClient.invalidateQueries({queryKey: ['itemsInCart']})
        },
        onError: (error) => {
            console.error("Add to cart failed:", error);
        }
    })

    return addToCartMutation
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient()
    const removeFromCartMutation = useMutation({
        mutationFn: async (itemToRemove: RemoveFromCart) => {
            await api.post("/cart/remove", itemToRemove)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['itemsInCart']})
            console.log(`Removed from cart!`)
        },
        onError: (error) => {
            console.error("Removing product from cart failed:", error);
        }
    })

    return removeFromCartMutation
}

export function useDecrementProductInCart() {
    const queryClient = useQueryClient()
    const decrementCartMutation = useMutation({
        mutationFn: async (itemToRemove: RemoveFromCart) => {
            await api.post("/cart/decrement", itemToRemove)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['itemsInCart']})
            console.log(`Successfully decremented!`)
        },
        onError: (error) => {
            console.error("Decrementing product from cart failed:", error);
        },
    })

    return decrementCartMutation
}

export function useCheckoutCart() {
    // const queryClient = useQueryClient()
    const checkoutMutation = useMutation({
        mutationFn: async (currency: Currency) => {
            try {
                const res = await api.post("/payment/stripe", { currency })
                return res.data as PaymentIntent
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Stripe backend error:", error.response?.data)

                    throw new Error(
                        error.response?.data || "Unable to retrieve client_secret from Stripe!"
                    )
                }
                throw error
            }
        },
        onSuccess: () => {
            console.log(`Successfully retrieved client_secret`)
        }
    })

    return checkoutMutation
}
