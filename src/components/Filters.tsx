
import { getFreeDeliveryTill} from "../utils/utils"
import { useState } from "react";
import { Products } from "../types";
import { useGetData } from "../utils/hooks";

function ShowProducts({
  title,
  rating,
  image,
  price,
}: Products) {
    return (
        <div className={`grid grid-cols-[auto,1fr] w-full mx-auto max-w-2xl`}>
            {/* Image */}
            <div className={`group h-56 w-56 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative  p-6 m-2 ml-8
             bg-gray-50 overflow-hidden`}>
                <img
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                src={image}
                alt={title}
                />
            </div>
            {/* Info*/}
            <div className="p-4 flex flex-col gap-1 mt-2">
                <h3 className="font-semibold">{title}</h3>
                <span className="text-sm">⭐{rating?.rate} ({rating?.count})</span>
                <span className="text-xs text-gray-800">{(Math.random() * 5 + 1).toFixed(1)}k+ bought in past month</span>
                <h2 className="font-bold text-lg">${price}</h2>
                <span className="text-xs text-gray-800">Upto 5% back with the <b className="text-red-800">YashERA</b> card</span>
                <span className="text-xs text-gray-800">FREE delivery till <b>{getFreeDeliveryTill()}</b></span>
                <button className="bg-[#FFCE14] w-fit px-2 py-1 rounded-full hover:shadow-md hover:opacity-80 mt-2 font-medium">Add to cart</button>
            </div>
    </div>
  );
}

export function FilterMenu() {
    const [filter, setFilter] = useState('')
    const {productData: originalProductData, isLoading, isError} = useGetData();

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Unable to retrieve products!</div>

    const productsData = originalProductData?.filter((data: Products) => filter ? data.category == filter : true)
    const listProducts = productsData?.map((product:Products) => (<ShowProducts {...product}></ShowProducts>))

    return (
        <div className="flex">        
            <div className="flex flex-col w-64 shrink-0 gap-1 pt-24 ml-5">
                <h1 className="font-semibold">Apply Filters</h1>
                <label className="accent-[#EDB6A3]"><input type="checkbox" checked={
                    filter == "jewelery"} onChange={() => setFilter(filter === "jewelery" ? "" : "jewelery")}/> Jewelery Only
                </label>
                <label className="accent-[#EDB6A3]"><input type="checkbox" checked={
                    filter == "men's clothing"} onChange={() => setFilter(filter === "men's clothing" ? "" : "men's clothing")}/> Men's Only
                </label>
                <label className="accent-[#EDB6A3]"><input type="checkbox" checked={
                    filter == "women's clothing"} onChange={() => setFilter(filter === "women's clothing" ? "" : "women's clothing")}/> Women's Only
                </label>
                <label className="accent-[#EDB6A3]"><input type="checkbox" checked={
                    filter == "electronics"} onChange={() => setFilter(filter === "electronics" ? "" : "electronics")}/> Electronics Only
                </label>
            </div>
            <div className="flex flex-col flex-1 items-center pt-24">
                {listProducts}
            </div>
            <div className="w-64 pt-24"> HELLO</div>
        </div>
    )
}
