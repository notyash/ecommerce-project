// import { useState } from "react";
// import { FilteredData, Products } from "../types";
// import { ShowProducts } from "../components/ProductsPage";
import { useQuery } from "@tanstack/react-query";

export function useGetData() {
        const { data: productData, isLoading, isError} = useQuery({
        queryKey: ['products'],
        queryFn: () => fetch('https://fakestoreapi.com/products').then(res => res.json())
        })
    
        // if (isLoading) return <div>Loading...</div>
    
        // if (isError) return <div>Unable to retrieve products!</div>
        return {productData, isLoading, isError}
}

// export function useGetFilteredData({filter}: FilteredData){
//     const {productData: originalProductData, isLoading, isError} = useGetData();
//     if (isLoading) return <div>Loading...</div>
//     if (isError) return <div>Unable to retrieve products!</div>

//     console.log(filter)

//     const jeweleryData = originalProductData?.filter((data:Products) => data.category === "jewelery")
//     const mensClothingData = originalProductData?.filter((data:Products) => data.category === "men's clothing")
//     const womensClothingData = originalProductData?.filter((data:Products) => data.category === "women's clothing")
//     const electronicsData = originalProductData?.filter((data:Products) => data.category === "electronics")

//     const products = filter === "jewelery" ? jeweleryData : filter === "men's clothing" ? mensClothingData : filter === "women's clothing" 
//     ? womensClothingData: filter === "electronics" ? electronicsData: originalProductData;

//     const listProducts = products?.map((product:Products) => (<ShowProducts {...product}></ShowProducts>))
//     return listProducts

// }