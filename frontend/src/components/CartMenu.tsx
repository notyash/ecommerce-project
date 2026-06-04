import { useAddToCart, useDecrementProductInCart, useGetItemsInCart } from "../hooks/useCart"
import { ItemInCart } from "../types/cart"

export function CartSideBar() {
    const {itemsInCart, isLoading, isError} = useGetItemsInCart()
    if (isLoading) return <div>Loading products added to cart!</div>
    if (isError) return null
    const listOfAddedItems = itemsInCart?.map(item => <ShowAddedToCart key={item.product_id} item={item}/>)

    return (
            <div className="flex flex-col w-96 sticky ml-auto mr-20 top-24 h-[960px] shrink-0 gap-1 pt-4 bg-[#F1F3F6] shadow-md">
                <div className="flex items-center pl-6 pr-6">
                    <h1 className="font-semibold text-xl hover:bg-[#EBEBEB] p-2">Shopping Cart </h1>
                    {/* <section className="flex items-center justify-center ml-auto bg-[#466EC3] w-7 h-7 rounded-full text-white">{itemsInCart.length}</section> */}
                </div>
                <hr className="mx-auto border-gray-300 my-3 w-80 mt-4 mb-4"></hr>
                <ul className="flex flex-col pl-6">
                    {listOfAddedItems}
                </ul>
            </div>
    )
}

function ShowAddedToCart({item}: {item: ItemInCart}){
    
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
                    <p className="font-normal">$ {item.current_price}</p>
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
