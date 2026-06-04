import { api } from "../utils/axios"
import { useMutation, useQuery } from "@tanstack/react-query";
import { AddToCart, ItemInCart } from "../types/cart";
import { queryClient } from "../utils/queryClient";

export function useAddToCart() {

    const addToCartMutation = useMutation({
        mutationFn: async (itemToAdd: AddToCart) => {
            try {
                const res = await api.post("/cart/add", JSON.stringify(itemToAdd))
                return res.data
            } catch {
                throw new Error("Product failed to add to cart!")
            }
        },
        onSuccess: async (data) => {
            console.log(`Added to cart!`, data)
            queryClient.setQueryData(['itemsInCart'], data)
        }
    })

    return addToCartMutation
}

export function useItemsInCart() {
    const { data: itemsInCart, isLoading, isError} = useQuery<ItemInCart[]>({
        queryKey: ['itemsInCart'],
        queryFn: () => null as unknown as ItemInCart[],
        staleTime: Infinity,
        enabled: false
    })

    return {itemsInCart, isLoading, isError}
}