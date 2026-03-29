import { useQuery } from "@tanstack/react-query";
import { Products } from "../types";

export function useGetData() {
        const { data: productData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products'], 
        queryFn: async ({ signal }) => {
                                        const res = await fetch('https://fakestoreapi.com/products', { signal })
                                        if (!res.ok) throw new Error('Failed to fetch products')
                                        return res.json()
                                        },
        staleTime: Infinity
        })
        return {productData, isLoading, isError}
}

export function useGetDataById(id: string) {
        const { data: productData, isLoading, isError} = useQuery<Products>({
        queryKey: ['products', id], 
        queryFn: async ({ signal }) => {
                                        const res = await fetch(`https://fakestoreapi.com/products/${id}`, { signal })
                                        if (!res.ok) throw new Error('Failed to fetch products')
                                        return res.json()
                                        },
        staleTime: Infinity,
        enabled: !!id
        })
        return {productData, isLoading, isError}
}