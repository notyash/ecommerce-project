import { api } from "../utils/axios"
import { useMutation } from "@tanstack/react-query";
import { AddToCart } from "../types/cart";

export function useAddToCart() {

    const addToCartMutation = useMutation({
        mutationFn: async (credentials: AddToCart) => {
            try {
                const res = await api.post("/cart/add", JSON.stringify(credentials))
                return res.data
            } catch {
                throw new Error("Product failed to add to cart!")
            }
        },
        onSuccess: async (data) => {
            console.log(`Added to cart!`, data)
        }
    })

    return addToCartMutation
}