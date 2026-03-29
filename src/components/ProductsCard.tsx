import { useContext } from "react";
import { CartDispatchContext } from "../context/CartContext";
import { Products } from "../types";
import { getFreeDeliveryTill, getRandomBought } from "../utils/utils";

export default function ShowProducts({product} : {product: Products}) {
    const {
      id,
      title,
      rating,
      image,
      price
        } = product

    const dispatch = useContext(CartDispatchContext)
    return (
        <div className={`grid grid-cols-[auto,1fr] w-full`}>
            {/* Image */}
            <div className={`group h-64 w-64 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 m-2 ml-8
             bg-[#F1F3F6] overflow-hidden`}>
                <img
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                src={image}
                alt={title}
                />
            </div>
            {/* Info*/}
            <div className="p-4 flex flex-col gap-1 mt-2 scale-125 origin-left pt-9">
                <h3 className="font-semibold">{title}</h3>
                <span className="text-sm">⭐{rating?.rate} ({rating?.count})</span>
                <span className="text-xs text-gray-800">{getRandomBought(id)}k+ bought in past month</span>
                <h2 className="font-bold text-lg">${price}</h2>
                <span className="text-xs text-gray-800">Upto 5% back with the <b className="text-[#4390C7]">YashERA</b> card</span>
                <span className="text-xs text-gray-800">FREE delivery till <b>{getFreeDeliveryTill(id)}</b></span>
                <button className="bg-[#466EC3] text-white w-fit px-2 py-1 rounded-full hover:shadow-md hover:bg-opacity-80 mt-2 font-medium"
                        onClick={()=>dispatch?.({type: "ADD_ITEM", payload: product})}>Add to cart</button>
            </div>
    </div>
  );
}