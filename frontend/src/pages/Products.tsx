import { FilterMenu } from "../components/FilterMenu";
import ProductsMenu from "../components/ProductsMenu";
import { useState } from "react";
import { useGetData } from "../hooks/useGetData";
import { NavBar } from "../components/NavBar";
import { CartSideBar } from "../components/CartMenu";
import { useGetItemsInCart } from "../hooks/useCart";

export default function ProductsPage({query}: {query: string}) {
    const {productsData, isError} = useGetData();
    const {itemsInCart} = useGetItemsInCart()
    const [filter, setFilter] = useState<string[]>([])
    if (isError) return <div>Unable to retrieve products!</div>
    if (!productsData) return null

    const toListProducts = productsData.filter(product => (product.title ?? "").toLowerCase().includes(query.toLowerCase()))
    
    return (
        <>
        <NavBar/>
        <div className="flex flex-row bg-white pt-24">  
            <FilterMenu filter={filter} setFilter={setFilter}/>
            <ProductsMenu products={toListProducts} filter={filter}/>
            {!!itemsInCart?.length && <CartSideBar />}
        </div>
        </>

    )
}