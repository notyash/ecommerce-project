import { FilterMenu } from "../components/FilterMenu";
import ProductsMenu from "../components/ProductsMenu";
import { useState } from "react";
import { useGetData } from "../hooks/useGetData";
import { NavBar } from "../components/NavBar";


export default function ProductsPage() {
    const {productsData, isError} = useGetData();
        
    const [filter, setFilter] = useState<string[]>([])
    const [query, setQuery] = useState("")

    if (isError) return <div>Unable to retrieve products!</div>
    if (!productsData) return null

    const toListProducts = productsData.filter(product => (product.title ?? "").toLowerCase().includes(query.toLowerCase()))

    return (
        <>
        <NavBar query={query} setQuery={setQuery}/>
        <div className="flex flex-row bg-white pt-24">  
            <FilterMenu filter={filter} setFilter={setFilter}/>
            <ProductsMenu products={toListProducts} filter={filter}/>
            
            {/* <CartMenu /> */}
        </div>
        </>

    )
}