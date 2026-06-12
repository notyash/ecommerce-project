export type AddToCart = {
  product_id: number
  quantity: number
}
export type RemoveFromCart = {
  product_id: number
}

export type ItemInCart = {
  title: string,
  images: string[],
  cart_id: number,
  product_id: number,
  quantity: number,
  current_price: string,
  rating: number | null,
  stock: number,
}

export type PaymentIntent = {
  id: string,
  client_secret: string,
  status: string
}