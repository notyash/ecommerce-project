
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

    function toggleFilter(category: string) {
        setFilter(filter.includes(category) ? filter.filter(item => item !== category) : [...filter, category])
    }

    const filteredData = productData?.filter((data: Products) => filter.length > 0 ? filter.includes(data.category ?? "") : true)
    const productsData = filteredData?.map((product:Products) => (<ShowProducts product={product} key={product.id}></ShowProducts>))
    const listOfAddedItems = cartItems.map(item => <ShowAddedToCart item={item}/>)

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
            <div className="flex flex-col flex-1">
                {productsData}
            </div>
            {/* Cart Menu */}
            <div className="flex flex-col w-96 sticky top-24 h-screen shrink-0 gap-1 pt-4 mr-5 bg-[#F9FAFC] shadow-[-2px_-8px_3px_rgba(0,0,0,0.1)]">
                <div className="flex items-center pl-6 pr-6">
                    <h1 className="font-semibold text-xl">Shopping Cart </h1>
                    <section className="flex items-center justify-center ml-auto bg-[#466EC3] w-7 h-7 rounded-full text-white">{cartItems.length}</section>
                </div>
                <hr className="border-gray-300 my-3 w-full mt-4 mb-4"></hr>
                <ul className="flex flex-col pl-6">
                    {listOfAddedItems}
                </ul>
            </div>
        </div>
    )
}

function QuantityControl({children, onClick, styles=""}: { children: React.ReactNode, onClick?: () => void, styles?: string}) {
    return (
        <div className={`flex justify-center items-center bg-white rounded-md w-4 h-5 shadow-md hover:shadow-lg transition-shadow duration-300 ${styles}`}>
            <button onClick={onClick}>{children}</button>
        </div>
    )
}

function ShowAddedToCart({item}: {item: Products}){
    const dispatch = useContext(CartDispatchContext)

    return (
            <li className="grid grid-cols-[auto,1fr] w-full pb-3">
                {/* Image */}
                <div className="group h-24 w-24 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 m-2
                bg-white overflow-hidden ">
                    <img src={item.image} alt={item.title} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"/>
                </div>
                {/* Item Text */}
                <div className="flex flex-col p-5 pl-0 h-24 m-2 gap-2 justify-center">
                    <h1 className="text-sm font-light">{item.title}</h1>
                    <p className="font-normal">$ {item.price}</p>
                </div>
                {/* Quantity */}
                <div className="flex">
                    <QuantityControl onClick={() => dispatch?.({type:"UPDATE_QUANTITY", payload:{id: item.id, quantity: item.quantity - 1}})}>-</QuantityControl>
                    <QuantityControl styles="mx-auto">{item.quantity}</QuantityControl>
                    <QuantityControl onClick={() => dispatch?.({type: "UPDATE_QUANTITY", payload: {id: item.id, quantity: item.quantity  + 1}})}>-</QuantityControl>
                </div>
            </li> 
    )
}