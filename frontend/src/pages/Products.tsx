import NavBar  from "../components/NavBar";
import { FilterMenu } from "../components/FilterMenu";
import ProductsMenu from "../components/ProductsMenu";
import { useState } from "react";
import { useGetUser } from "../hooks/useGetUser";
import { useGetData } from "../hooks/useGetData";


export default function ProductsPage() {
    const {productsData, isError} = useGetData();
    const [filter, setFilter] = useState<string[]>([])
    const {data} = useGetUser();
    console.log(data);
    if (isError) return <div>Unable to retrieve products!</div>
    if (!productsData) return null
    console.log('ProductsPage rendered')
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