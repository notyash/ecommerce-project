import { useQuery } from "@tanstack/react-query";
import { Products } from "../types";

export function useGetData() {
        const { data: productData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products'], 
        queryFn: () => fetch('https://fakestoreapi.com/products').then(res => res.json()),
        staleTime: Infinity
        })
        return {productData, isLoading, isError}
}