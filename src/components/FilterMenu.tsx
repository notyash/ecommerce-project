
import { useContext, useState } from "react";
import { Products } from "../types";
import ShowProducts from "./ProductsCard";
import { CartContext, CartDispatchContext } from "../context/CartContext";

const categories = [
    {label: "men's clothing", display_name: "Men's Clothing"},
    {label: "women's clothing", display_name: "Women's Clothing"},
    {label: "jewelery", display_name: "Jewelry"},
    {label: "electronics", display_name: "Electronics"}
]

export function FilterMenu({productData}: {productData?: Products[]}) {
    const [filter, setFilter] = useState<string[]>([])
    const cartItems = useContext(CartContext)
    const dispatch = useContext(CartDispatchContext)

    function toggleFilter(category: string) {
        setFilter(filter.includes(category) ? filter.filter(item => item !== category) : [...filter, category])
    }

    const filteredData = productData?.filter((data: Products) => filter.length > 0 ? filter.includes(data.category ?? "") : true)
    const productsData = filteredData?.map((product:Products) => (<ShowProducts product={product} key={product.id}></ShowProducts>))

    return (
        <div className="flex bg-[#FFFFFF] pt-24">        
            {/* {Filter Menu} */}
            <div className="flex flex-col w-64 sticky top-24 h-screen shrink-0 gap-1 pt-4 ml-5 bg-[#EBEBEB]">
                <h1 className="font-semibold pl-6 text-xl">Filters</h1>
                <hr className="border-gray-300 my-3 w-full mt-4 mb-4"></hr>
                <h2 className="font-semibold mb-3 pl-6">Categories:</h2>
                {categories.map(category => <label key={category.label} className="accent-[#466EC3] p-1 pl-6"><input type="checkbox" checked={
                filter.includes(category.label)} onChange={() => toggleFilter(category.label)}/> {category.display_name}</label>)}
            </div>
            {/* {Produtcts Menu} */}
            <div className="flex flex-col flex-1 items-center">
                {productsData}
            </div>
            <div className="flex flex-col w-64 sticky top-24 h-screen shrink-0 gap-1 pt-4 mr-5 bg-[#EBEBEB]">
                <h1 className="font-semibold text-xl pl-6 bg-[]">🛒 Your Cart: {cartItems.length}</h1>
                <hr className="border-gray-300 my-3 w-full mt-4 mb-4"></hr>
                <ul>
                    {cartItems.map(item => <li>- {item.title}<button className="bg-[#466EC3]" onClick={ () =>
                        dispatch?.({type:"REMOVE_ITEM", payload:{id: item.id}})}>Remove From Cart</button> </li> )}
                </ul>
            </div>
        </div>
    )
}
