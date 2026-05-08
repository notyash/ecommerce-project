import { useMutation, useQuery } from "@tanstack/react-query";
import { User, Products, AddToCart as TAddToCart } from "../types";
import { useContext } from "react";
import { CartDispatchContext } from "../context/CartContext";
import { useGoogleLogin } from "@react-oauth/google";

export function useGoogleOAuthLogin(){
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        scope: 'openid email profile',
        onSuccess: async (codeResponse) => {
            try {
                const response = await fetch('/api/auth/oauth', {
                    headers: {'Content-Type': 'application/json',},
                    method: 'POST',
                    body: JSON.stringify({code: codeResponse.code}),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Backend authentication failed');
                }
                const userDto: User = await response.json();
                console.log(`Logged in as: ${userDto.name} ${userDto}`)
            } catch (err) {
                console.error("Server-side login error:", err);
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });
    return googleLogin
}

export function useGetData() {
        const { data: productsData, isLoading, isError} = useQuery<Products[]>({
        queryKey: ['products'], 
        queryFn: async ({ signal }) => {
                                        const res = await fetch('/api/products', { signal })
                                        if (!res.ok) throw new Error('Failed to fetch products')
                                        return await res.json()
                                        },
        staleTime: Infinity
        })
        return {productsData, isLoading, isError}
}

export function useGetDataById(productID: number) {
        const { data: productData, isLoading, isError} = useQuery<Products>({
        queryKey: ['products', productID], 
        queryFn: async ({ signal }) => {
                                        const res = await fetch(`/api/products/${productID}`, { signal })
                                        if (!res.ok) throw new Error('Failed to fetch products')
                                        return await res.json()
                                        },
        staleTime: Infinity,    
        enabled: !!productID
        })
        return {productData, isLoading, isError}
}


function useGetCartById(userID: number = 1) {
        const {data: cartData, isError, isLoading} = useQuery<Products>({
                queryKey: ['carts', userID],
                queryFn: async ({signal}) => {
                         const res = await fetch(`https://dummyjson.com/carts/${userID}`, {signal})
                         if (!res.ok) throw new Error(`Failed to fetch cart with id: ${userID}.`)
                         return await res.json()
                         },
                staleTime: Infinity,
                enabled: !!userID
                })
        return {cartData, isLoading, isError}
}

async function createNewCart({products}:TAddToCart){
        const res = await fetch('https://dummyjson.com/carts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        userId: 1,
                        products: products
                        })
                })
        return res
}

async function updateCart({cartID, products}:TAddToCart){
        const res = await fetch(`https://dummyjson.com/carts/${cartID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        merge: true, 
                        products: products
                        })
                })
        return res
}

async function addToCart(products:TAddToCart) {
        const {cartID} = products
        console.log(cartID)
        if (cartID) {
                const res = await updateCart(products)
                return await res.json()
        }
        console.log('cart doesnt exist, creating a new one')
        const res = await createNewCart(products)
        return await res.json()
}

export function useMutateCart(){
        const dispatch = useContext(CartDispatchContext)
        const cart = useMutation({
                mutationFn: (products:TAddToCart) => addToCart(products),
                onMutate: (variables, context) => {
                        console.log(' updating cart')
                },
                onError: (error, variables, onMutateResult, context) => {
                        console.log('error occured', error)
                },
                onSuccess: (data, variables, onMutateResult, context) => {
                        dispatch?.({type: 'ADD_ID', payload:{id: data.id}})
                },
                onSettled: (data, error, variables, onMutateResult, context) => {
                        console.log(data)
                }
        })
        return cart
}