import { api } from "../utils/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToCart, ItemInCart, RemoveFromCart } from "../types/cart";

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

