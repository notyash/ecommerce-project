import React, { createContext, useReducer } from "react";
import { CartAction, Products } from "../types";

export const CartContext = createContext<Products[]>([])
export const CartDispatchContext = createContext<React.Dispatch<CartAction> | null> (null)

const initialCart:Products[] = []

export function CartProvider({children}: {children: React.ReactNode}){
    const [cartItems, dispatch] = useReducer(cartReducer, initialCart)

    return (
        <CartContext value={cartItems}>
            <CartDispatchContext value={dispatch}>
                {children}
            </CartDispatchContext>
        </CartContext>
    )
}

function cartReducer(cartItems: Products[], action: CartAction): Products[] {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = cartItems.find(item => item.id === action.payload.id)
            if (existingItem) {
                return cartItems
            }
            return [...cartItems, {...action.payload, quantity: 1}]
        }
        case 'REMOVE_ITEM': {
            return cartItems.filter(item =>  item.id !== action.payload.id)
        }
        // adding other actions are remaining
        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity === 0) {
                return cartItems.filter(item =>  item.id !== action.payload.id)
            }
            return cartItems.map(item => item.id == action.payload.id ? {...item, quantity: action.payload.quantity} : item)
        }
        default:
            return cartItems
    }
}