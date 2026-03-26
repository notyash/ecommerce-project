import { Products } from "../types";
import { getFreeDeliveryTill, getRandomBought } from "../utils/utils";

export default function ShowProducts({
  id,
  title,
  rating,
  image,
  price,
}: Products) {
    return (
        <div className={`grid grid-cols-[auto,1fr] w-full mx-auto max-w-2xl`}>
            {/* Image */}
            <div className={`group h-56 w-56 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative p-6 m-2 ml-8
             bg-[#EFEDE7] overflow-hidden`}>
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
                <span className="text-xs text-gray-800">{getRandomBought(id)}k+ bought in past month</span>
                <h2 className="font-bold text-lg">${price}</h2>
                <span className="text-xs text-gray-800">Upto 5% back with the <b className="text-red-800">YashERA</b> card</span>
                <span className="text-xs text-gray-800">FREE delivery till <b>{getFreeDeliveryTill(id)}</b></span>
                <button className="bg-[#FFCE14] w-fit px-2 py-1 rounded-full hover:shadow-md hover:opacity-80 mt-2 font-medium">Add to cart</button>
            </div>
    </div>
  );
}