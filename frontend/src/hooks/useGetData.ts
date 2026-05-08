import { useQuery } from "@tanstack/react-query"
import { Products } from "../types"

export function useGetData() {
        const { data: productsData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products'], 
        queryFn: async ({ signal }) => {
                                        const res = await fetch('/api/products', { signal })
                                        if (!res.ok) throw new Error('Failed to fetch products')
                                        return await res.json()
                                        },
        staleTime: Infinity
        })
        return {productsData, isLoading, isError}
}

export function useGetDataById(productID: number) {
        const { data: productData, isLoading, isError} = useQuery<Products>({
        queryKey: ['products', productID], 
        queryFn: async ({ signal }) => {
                                        const res = await fetch(`/api/products/${productID}`, { signal })
                                        if (!res.ok) throw new Error('Failed to fetch products')
                                        return await res.json()
                                        },
        staleTime: Infinity,    
        enabled: !!productID
        })
        return {productData, isLoading, isError}
}
