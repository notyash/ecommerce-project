export type Data = {
  limit?: number
  products: Products[] 
}

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

export type Products = {
  id: number;
  availabilityStatus?: string;
  category?: string;
  description?: string;
  dimensions?: {depth: number, height: number, width: number};
  discountPercentage?: number
  images?: string[]
  minimumOrderQuantity?: number
  price?: number
  rating?: number
  returnPolicy?: string
  reviews?: {rating: number, comment: string, date:string}[]
  shippingInformation?: string
  stock?: number
  tags?: string[]
  thumbnail?: string
  title?: string
  warrantyInformation?: string
};

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
