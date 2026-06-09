import { useGetItemsInCart } from "../hooks/useCart"

export default function CheckoutMenu() {
    const {itemsInCart} = useGetItemsInCart()

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
                <span className="flex text-lg">Subtotal ({itemsInCart?.length} items): <p className="font-bold ml-2">${totalPrice}</p></span>
                <button className="flex items-center justify-center w-[200px] border rounded-lg p-1 bg-yellow-300 hover:bg-yellow-400 transition-all duration-500">Proceed to buy</button>
            </div>
        </div>
    )
}