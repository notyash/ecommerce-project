import { api } from "../utils/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToCart, ItemInCart, RemoveFromCart } from "../types/cart";
import { PaymentIntent } from "../types/payment";

export function useGetItemsInCart() {
    const { data: itemsInCart, isLoading, isError} = useQuery<ItemInCart[]>({
        queryKey: ['itemsInCart'],
        queryFn: async () => {
            const res = await api.get('/cart/items')
            return res.data
        },
        })
        
    return {itemsInCart, isLoading, isError}
}

export function useAddToCart() {
    const queryClient = useQueryClient()
    const addToCartMutation = useMutation({
        mutationFn: async (itemToAdd: AddToCart) => {
            try {
                await api.post("/cart/add", itemToAdd)
            } catch {
                throw new Error("Product failed to add to cart!")
            }
        },
        onSuccess: () => {
            console.log(`Added to cart!`)
            queryClient.invalidateQueries({queryKey: ['itemsInCart']})
        }
    })

    return addToCartMutation
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient()
    const removeFromCartMutation = useMutation({
        mutationFn: async (itemToRemove: RemoveFromCart) => {
            try {
                await api.post("/cart/remove", itemToRemove)
            } catch {
                throw new Error("Product failed to remove from cart!")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['itemsInCart']})
            console.log(`Removed from cart!`)
        }
    })

    return removeFromCartMutation
}

export function useDecrementProductInCart() {
    const queryClient = useQueryClient()
    const decrementCartMutation = useMutation({
        mutationFn: async (itemToRemove: RemoveFromCart) => {
            try {
                await api.post("/cart/decrement", itemToRemove)
            } catch {
                throw new Error("Decrement failed!")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['itemsInCart']})
            console.log(`Successfully decremented!`)
        }
    })

    return decrementCartMutation
}

export function useCheckoutCart() {
    // const queryClient = useQueryClient()
    const checkoutMutation = useMutation({
        mutationFn: async (cart_id: number) => {
            try {
                const res = await api.post("/payment/stripe", cart_id)
                return res.data as PaymentIntent
            } catch {
                throw new Error("Unable to retrieve client_secret from stripe!")
            }
        },
        onSuccess: (res) => {
            console.log(`Successfully retrieved client_secret`)
            console.log(res)
        }
    })

    return checkoutMutation
}
