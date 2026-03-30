import NavBar  from "../components/NavBar";
import { FilterMenu } from "../components/FilterMenu";
import { useGetData } from "../utils/hooks";
import ProductsMenu from "../components/ProductsCard";
import { useState } from "react";
import CartMenu from "../components/CartMenu";


export default function ProductsPage() {
    const {productData, isError} = useGetData();
    const [filter, setFilter] = useState<string[]>([])

    if (isError) return <div>Unable to retrieve products!</div>
    if (!productData) return null

    return (
        <>
        <NavBar />
        <div className="flex bg-white pt-24">  
            <FilterMenu filter={filter} setFilter={setFilter}/>
            <ProductsMenu productData={productData} filter={filter}/>
            <CartMenu />
        </div>
        </>

    )
}