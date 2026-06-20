import { useAddToCart, useDecrementProductInCart, useGetItemsInCart } from "../hooks/useCart"
import { ItemInCart } from "../types/cart"
import { Currency, CurrencySymbol } from "../types/payment";

export function CartSideBar({currency, symbol}:{currency: Currency, symbol: CurrencySymbol}) {
    const {itemsInCart, isLoading, isError} = useGetItemsInCart(currency)
    if (isLoading) return <div>Loading products added to cart!</div>
    if (isError) return null
    const listOfAddedItems = itemsInCart?.map(item => <ShowAddedToCart key={item.product_id} item={item} symbol={symbol}/>)
    return (
        <div className="sticky top-24 self-start ml-auto mr-20 flex w-96 shrink-0 flex-col max-h-[calc(100vh-6rem)] bg-[#F1F3F6] pt-4 shadow-md">
            <div className="flex items-center px-6">
                <h1 className="font-semibold text-xl hover:bg-[#EBEBEB] p-2">
                Shopping Cart
                </h1>

                <section className="flex items-center justify-center ml-auto bg-[#466EC3] w-7 h-7 rounded-full text-white">
                {itemsInCart?.length}
                </section>
            </div>

            <hr className="mx-auto border-gray-300 my-4 w-80" />

            <ul className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pl-6 pb-4">
                {listOfAddedItems}
            </ul>
        </div>
    )
}

function ShowAddedToCart({item, symbol}: {item: ItemInCart, symbol: CurrencySymbol}){
    const addToCartMutation = useAddToCart()
    const decrementMutation = useDecrementProductInCart()
    return (
            <li className="grid grid-cols-[auto,1fr] w-full pb-3">
                {/* Image */}
                <div className="group h-24 w-24 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 m-2
                bg-white overflow-hidden ">
                    <img src={item.images[0]} alt={item.title} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"/>
                </div>
                {/* Item Text */}
                <div className="flex flex-col p-5 pl-0 h-24 m-2 gap-2 justify-center">
                    <h1 className="text-sm font-light">{item.title}</h1>
                    <p className="font-normal">{symbol}{Number(item.current_price).toFixed(2)}</p>
                </div>
                {/* Quantity */}
                <div className="flex">
                    <button className="flex justify-center items-center mx-auto bg-white rounded-md w-5 h-5 shadow-md hover:shadow-lg transition-shadow duration-300"
                            onClick={() => addToCartMutation.mutate({product_id: item.product_id, quantity: 1})}
                            disabled={addToCartMutation.isPending}>
                                +
                    </button>
                    <p className="flex justify-center items-center mx-auto bg-white rounded-md w-5 h-5">{item.quantity}</p>
                    <button className="flex justify-center items-center mx-auto bg-white rounded-md w-5 h-5 shadow-md hover:shadow-lg transition-shadow duration-300"
                            onClick={() => decrementMutation.mutate({product_id: item.product_id})}
                            disabled={decrementMutation.isPending}>
                                -
                    </button>
                </div>
            </li> 
    )
}
