import { useQuery } from "@tanstack/react-query"
import { Products } from "../types/product"
import { api } from "../utils/axios"
import { Currency } from "../types/payment"

export function useGetAllProducts(currency: Currency) {
        const { data: productsData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products', currency], 
        queryFn: async () => {
            const res = await api.get('/products', {
                params: {currency}
            })
            return res.data
        },
        staleTime: Infinity
        })
        return {productsData, isLoading, isError}
}

export function useGetProductById(productID: number, currency: Currency) {
        const { data: productData, isLoading, isError} = useQuery<Products>({
        queryKey: ['products', productID, currency], 
        queryFn: async () => {
            const res = await api.get(`/products/${productID}`, {
                params: {currency}
            })
            return res.data
        },
        staleTime: Infinity,    
        enabled: productID > 0
        })
        return {productData, isLoading, isError}
}
