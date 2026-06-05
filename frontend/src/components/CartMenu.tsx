import { useGetItemsInCart } from "../hooks/useCart"
import { ItemInCart } from "../types/cart"
import { getFreeDeliveryTill} from "../utils/utils"

export default function CartMenu() {
    const {itemsInCart, isLoading, isError} = useGetItemsInCart()
    if (isError) return <div>Unable to retrieve products!</div>
    if (isLoading) return <div>Loading cart..</div>
    if (!itemsInCart) return null

    const productsInCart = itemsInCart.map((product:ItemInCart) => <ShowCartItems item={product}/>)
    return (
        <main className="min-h-screen pt-20">
            <div className="mt-8 mx-auto flex w-fit gap-6 items-start">
                <div className="flex flex-col w-[1000px] min-h-[calc(100vh-5rem)] bg-white gap-4"> {/* 100vh - 100% of viewport heigh & 1 rem = 16px,
                                                                                                                so 5rem = 80px(height of the navbar) - pt-20 */}
                    <div className="flex flex-row items-center gap-4 mt-4">
                        <h1 className="text-3xl font-semibold ml-6">Shopping Cart</h1>
                        <p className="text-2xl ml-auto pr-6 font-semibold w-8">{itemsInCart.length}</p>
                    </div>
                    <hr className="w-[95%] mx-auto border-2 border-[#EEEEEE]"/>
                    {productsInCart}
                </div>
                <div className="sticky top-28 self-start flex flex-col bg-white h-[600px] w-[400px] gap-4">
                    <h1 className="text-3xl font-semibold mr-auto ml-6 mt-4">Checkout</h1>
                    <hr className="w-[90%] mx-auto border-2 border-[#EEEEEE]"/>
                </div>
            </div>
        </main>
    )
}

export function ShowCartItems({item}:{item: ItemInCart}) {

    return (
        <div className={`grid grid-cols-[auto,1fr] w-full`}>
            {/* Image */}
            <div className={`group h-64 w-64 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 m-2 ml-8
             bg-[#F1F3F6] overflow-hidden`}>
                <img
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                src={item.images?.[0]}
                alt={item.title}
                />
            </div>
            {/* Info*/}
            <div className="p-4 flex flex-col gap-1 mt-2 scale-125 origin-left pt-12">
                <h3 className="font-semibold">{item.title}</h3>
                <span className="text-xs font-semibold text-green-600">{item.stock > 0 ? "In stock" : "Out of stock"}</span>
                <h2 className="font-bold text-lg">${item.current_price}</h2>
                <span className="text-xs text-gray-800">Upto 5% back with the <b className="text-[#4390C7]">YashERA</b> card</span>
                <span className="text-xs text-gray-800">FREE delivery till <b>{getFreeDeliveryTill(item.product_id)}</b></span>
                <div className="flex flex-row items-center justify-center font-bold gap-4 border-2 border-blue-100 rounded-lg w-[70px] mt-2">
                    <button>-</button>
                    <span className="text-xs text-gray-800 font-semibold">{item.quantity}</span>
                    <button>+</button>
                </div>
            </div>
    </div>
    )
}