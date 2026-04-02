import React, { createContext, useReducer, useState } from "react";
import { CartAction, Products, SavedCarts } from "../types";

export const CartContext = createContext<Products[]>([])
export const CartDispatchContext = createContext<React.Dispatch<CartAction> | null> (null)

const initialCart:SavedCarts[] = []

export function CartProvider({children}: {children: React.ReactNode}){
    const [cartIDs, dispatch] = useReducer(cartReducer, initialCart)

    return (
        <CartContext value={cartIDs}>
            <CartDispatchContext value={dispatch}>
                {children}
            </CartDispatchContext>
        </CartContext>
    )
}

function cartReducer(cartIDs: SavedCarts[], action: CartAction): SavedCarts[] {
    switch (action.type) {
        case 'ADD_ID': {
            const existingItem = cartIDs.find(item => item.id === action.payload.id)
            if (existingItem) {
                return cartIDs
            }
            return [...cartIDs, {...action.payload}]
        }
        case 'REMOVE_ID': {
            return cartIDs.filter(item =>  item.id !== action.payload.id)
        }
        default:
            return cartIDs
    }
}