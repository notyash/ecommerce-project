import { useQuery } from "@tanstack/react-query"
import { Products } from "../types/product"
import { api } from "../utils/axios"

export function useGetData() {
        const { data: productsData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products'], 
        queryFn: async () => {
            const res = await api.get('/products')
            return res.data
        },
        staleTime: Infinity
        })
        return {productsData, isLoading, isError}
}

export function useGetDataById(productID: number) {
        const { data: productData, isLoading, isError} = useQuery<Products>({
        queryKey: ['products', productID], 
        queryFn: async () => {
            const res = await api.get(`/products/${productID}`)
            return res.data
        },
        staleTime: Infinity,    
        enabled: !!productID
        })
        return {productData, isLoading, isError}
}
