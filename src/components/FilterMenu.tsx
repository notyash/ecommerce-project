
import { useState } from "react";
import { Products } from "../types";
import { useGetData } from "../utils/hooks";
import ShowProducts from "./ProductsCard";

const categories = [
    {label: "men's clothing", display_name: "Men's Clothing"},
    {label: "women's clothing", display_name: "Women's Clothing"},
    {label: "jewelery", display_name: "Jewelry"},
    {label: "electronics", display_name: "Electronics"}
]

export function FilterMenu() {
    const [filter, setFilter] = useState<string[]>([])
    const {productData: originalProductData, isLoading, isError} = useGetData();

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Unable to retrieve products!</div>

    function toggleFilter(category: string) {
        setFilter(filter.includes(category) ? filter.filter(item => item !== category) : [...filter, category])
    }

    const filteredData = originalProductData?.filter((data: Products) => filter.length > 0 ? filter.includes(data.category ?? "") : true)
    const productsData = filteredData?.map((product:Products) => (<ShowProducts {...product} key={product.id}></ShowProducts>))

    return (
        <div className="flex bg-[#F4F3EE] pt-24">        
            {/* {Filter Menu} */}
            <div className="flex flex-col w-64 sticky top-24 h-screen shrink-0 gap-1 pt-1 ml-5 bg-[#EFEDE7]">
                <h1 className="font-semibold pl-4">Filters</h1>
                <hr className="border-gray-300 my-3 w-full"></hr>
                <h2 className="font-semibold mb-3 pl-4">Categories:</h2>
                {categories.map(category => <label key={category.label} className="accent-[#EDB6A3] p-1 pl-4"><input type="checkbox" checked={
                filter.includes(category.label)} onChange={() => toggleFilter(category.label)}/> {category.display_name}</label>)}
            </div>
            {/* {Produtcts Menu} */}
            <div className="flex flex-col flex-1 items-center">
                {productsData}
            </div>
            <div className="flex flex-col w-64 sticky top-24 h-screen shrink-0 gap-1 ml-5 pl-4 bg-[#EFEDE7]">idk
                <p>what to put here</p>
            </div>
        </div>
    )
}
