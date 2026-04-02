import NavBar  from "../components/NavBar";
import { FilterMenu } from "../components/FilterMenu";
import { useGetData } from "../utils/hooks";
import ProductsMenu from "../components/ProductsMenu";
import { useState } from "react";


export default function ProductsPage() {
    const {productsData, isError} = useGetData();
    const [filter, setFilter] = useState<string[]>([])

    if (isError) return <div>Unable to retrieve products!</div>
    if (!productsData) return null

    return (
        <>
        <NavBar />
        <div className="flex bg-white pt-24">  
            <FilterMenu filter={filter} setFilter={setFilter}/>
            <ProductsMenu products={productsData} filter={filter}/>
            {/* <CartMenu /> */}
        </div>
        </>

    )
}