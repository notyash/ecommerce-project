import { useContext } from "react"
import { CartContext, CartDispatchContext } from "../context/CartContext"
import { Products } from "../types"

export default function CartMenu() {
        const cartItems = useContext(CartContext)
        const listOfAddedItems = cartItems.map(item => <ShowAddedToCart item={item}/>)

        return (
                <div className="flex flex-col w-96 sticky top-24 h-screen shrink-0 gap-1 pt-4 mr-5 bg-[#F1F3F6] shadow-md">
                    <div className="flex items-center pl-6 pr-6">
                        <h1 className="font-semibold text-xl hover:bg-[#EBEBEB] p-2">Shopping Cart </h1>
                        <section className="flex items-center justify-center ml-auto bg-[#466EC3] w-7 h-7 rounded-full text-white">{cartItems.length}</section>
                    </div>
                    <hr className="mx-auto border-gray-300 my-3 w-80 mt-4 mb-4"></hr>
                    <ul className="flex flex-col pl-6">
                        {listOfAddedItems}
                    </ul>
                </div>
        )
    }

function ShowAddedToCart({item}: {item: Products}){
    const setCartID = useContext(CartDispatchContext)

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
                    <QuantityControl onClick={() => setCartID?.({type:"UPDATE_QUANTITY", payload:{id: item.id, quantity: item.quantity - 1}})}>-</QuantityControl>
                    <QuantityControl styles="mx-auto">{item.quantity}</QuantityControl>
                    <QuantityControl onClick={() => setCartID?.({type: "UPDATE_QUANTITY", payload: {id: item.id, quantity: item.quantity  + 1}})}>+</QuantityControl>
                </div>
            </li> 
    )
}


function QuantityControl({children, onClick, styles=""}: { children: React.ReactNode, onClick?: () => void, styles?: string}) {
    return (
        <div className={`flex justify-center items-center bg-white rounded-md w-4 h-5 shadow-md hover:shadow-lg transition-shadow duration-300 ${styles}`}>
            <button onClick={onClick}>{children}</button>
        </div>
    )
}

export function ProductsInCart({data} : {data?: Products}){
    return (
        <div className="grid grid-cols-[auto,1fr] pt-24">
            {data?.title}
            {/* <div className="mx-auto">
                {data}
            </div>
            <div className="">
                hi
            </div> */}
        </div>
    )
}