import { FilterMenu } from "../components/FilterMenu";
import ProductsMenu from "../components/ProductsMenu";
import { useState } from "react";
import { useGetAllProducts } from "../hooks/useProducts";
import { NavBar } from "../components/NavBar";
import { CartSideBar } from "../components/CartSidebar";
import { useGetItemsInCart } from "../hooks/useCart";
import { useCurrencyStore } from "../store/currencyStore";

export default function ProductsPage({query}: {query: string}) {
    const currency = useCurrencyStore((state) => state.currency);
    const currency_symbol = useCurrencyStore((state) => state.symbol)
    const {productsData, isError} = useGetAllProducts(currency)
    const {itemsInCart} = useGetItemsInCart(currency)
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
            {!!itemsInCart?.length && <CartSideBar currency={currency} symbol={currency_symbol} />}
        </div>
        </>

    )
}