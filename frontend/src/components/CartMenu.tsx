import { useNavigate } from "@tanstack/react-router"
import { useAddToCart, useDecrementProductInCart, useGetItemsInCart } from "../hooks/useCart"
import { ItemInCart } from "../types/cart"
import { getFreeDeliveryTill} from "../utils/utils"
import EmptyCart from "./EmptyCart"
import { useCurrencyStore } from "../store/currencyStore"
import { Currency, CurrencySymbol } from "../types/payment"

export default function CartMenu() {
    const currency = useCurrencyStore((state) => state.currency);
    const currency_symbol = currency === "usd" ? "$" : "₹" // can change this logic to support more currencies later
    const {itemsInCart, isLoading, isError} = useGetItemsInCart(currency)
    if (isError) return <div>Unable to retrieve products!</div>
    if (isLoading) return <div>Loading cart..</div>
    if (!itemsInCart) return null

    return (
        <main className="min-h-screen pt-20">
            <div className="mt-8 flex w-full justify-center gap-6 items-start">
                {/* Product Listing */}
                {itemsInCart.length > 0 ? <ProductListings currency={currency} symbol={currency_symbol}/> : <EmptyCart/>}
                {/* CheckoutMenu */}
                {itemsInCart.length > 0 && <CheckoutMenu currency={currency} symbol={currency_symbol}/>}
            </div>
        </main> 
    )
}

function CheckoutMenu({currency, symbol}: {currency: Currency, symbol: CurrencySymbol}) {
    const navigate = useNavigate()
    const {itemsInCart} = useGetItemsInCart(currency)
    function getTotalPriceInCart() {
        let totalPrice = 0
        for (const item of itemsInCart ?? []) { totalPrice += Number(item.current_price) * item.quantity; }
        const formattedTotalPrice = totalPrice.toFixed(2);
        return formattedTotalPrice
    }   

    const totalPrice = getTotalPriceInCart()
    return (
        <div className="sticky top-28 self-start flex flex-col bg-white h-fit w-[300px] gap-4 pb-6">
            <h1 className="text-3xl font-semibold mr-auto ml-6 mt-4">Checkout</h1>
            <hr className="w-[90%] mx-auto border-2 border-[#EEEEEE]"/>
            <div className="flex flex-col ml-6 gap-4">
                <span className="flex text-lg">Subtotal ({itemsInCart?.length} items): <p className="font-bold ml-2">{symbol}{totalPrice}</p></span>
                <button 
                    className="flex items-center justify-center w-[200px] border rounded-lg p-1 bg-yellow-300 hover:bg-yellow-400 transition-all duration-500"
                    onClick={() => navigate({to: "/checkout"})}>Proceed to buy</button>
            </div>
        </div>
    )
}


function ProductListings({currency, symbol}: {currency: Currency, symbol: CurrencySymbol}) {
    const {itemsInCart, isLoading, isError} = useGetItemsInCart(currency)
    if (isError) return <div>Unable to retrieve products!</div>
    if (isLoading) return <div>Loading cart..</div>
    if (!itemsInCart) return null
    const productsInCart = itemsInCart.map((product:ItemInCart) => <ShowCartItems item={product} symbol={symbol}/>)

    return (
        <div className="flex flex-col w-[1000px] min-h-[calc(100vh-5rem)] bg-white gap-4"> {/* 100vh - 100% of viewport heigh & 1 rem = 16px,
                                                                                                                so 5rem = 80px(height of the navbar) - pt-20 */}
            <div className="flex flex-row items-center gap-4 mt-4">
                <h1 className="text-3xl font-semibold ml-6">Shopping Cart</h1>
                <p className="text-2xl ml-auto pr-6 font-semibold w-8">{itemsInCart.length}</p>
            </div>
            <hr className="w-[95%] mx-auto border-2 border-[#EEEEEE]"/>
            {productsInCart}
        </div>
    )
}

function ShowCartItems({item, symbol}:{item: ItemInCart, symbol: CurrencySymbol}) {
    const addToCartMutation = useAddToCart()
    const decrementMutation = useDecrementProductInCart()
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
                <h2 className="font-bold text-lg">{symbol}{Number(item.current_price).toFixed(2)}</h2> 
                <span className="text-xs text-gray-800">Upto 5% back with the <b className="text-[#4390C7]">YashERA</b> card</span>
                <span className="text-xs text-gray-800">FREE delivery till <b>{getFreeDeliveryTill(item.product_id)}</b></span>
                <div className="flex flex-row items-center justify-center font-bold gap-4 border-2 border-blue-100 rounded-lg w-[70px] mt-2">
                    <button onClick={() => decrementMutation.mutate({product_id: item.product_id})}>-</button>
                    <span className="text-xs text-gray-800 font-semibold">{item.quantity}</span>
                    <button onClick={() => addToCartMutation.mutate({product_id: item.product_id, quantity: 1})}>+</button>
                </div>
            </div>
    </div>
    )
}