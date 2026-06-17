import { Currency } from "./payment"

export type ModifyCartDTO = {
  product_id: number
  quantity?: number,
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
