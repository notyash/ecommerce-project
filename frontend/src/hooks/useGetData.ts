import { useQuery } from "@tanstack/react-query"
import { Products } from "../types/product"
import { api } from "../utils/axios"
import { AxiosError } from "axios"

export function useGetData() {
        const { data: productsData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products'], 
        queryFn: async () => {
            try {
                const res = await api.get('/products')
                return res.data
            } catch (e) {
                if (e instanceof AxiosError) { console.error('Unexpected error:', e) }
                else { console.error('Unexpected error:', e) }
                throw new Error('Login failed');
            }
        },
        staleTime: Infinity
        })
        return {productsData, isLoading, isError}
}

export function useGetDataById(productID: number) {
        const { data: productData, isLoading, isError} = useQuery<Products>({
        queryKey: ['products', productID], 
        queryFn: async () => {
            try {
                const res = await api.get(`/products/${productID}`)
                return res.data
            } catch (e) {
                if (e instanceof AxiosError) { console.error('Unexpected error:', e) }
                else { console.error('Unexpected error:', e) }
                throw new Error('Login failed');
            }
        },
        staleTime: Infinity,    
        enabled: !!productID
        })
        return {productData, isLoading, isError}
}
