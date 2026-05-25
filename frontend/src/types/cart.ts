import { Products } from "./product"

export type Carts = {
  carts: Products[]
}

export type AddToCart = {
  cartID: number
  products: {id: number, quantity: number}[]
}

export type SavedCarts = {
  id: number
}

export type NavItem = {
  children: React.ReactNode;
  styles?: string;
  path: string;
};

export type FilteredData = {
  filter: string;
  setFilter?: (value: string) => void;
}

export type CartAction =  { type: 'ADD_ID'; payload: SavedCarts } | 
                          { type: 'REMOVE_ID'; payload: { id: number } } |
                          { type: 'CLEAR_CART' }
