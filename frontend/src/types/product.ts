export type Data = {
  limit?: number
  products: Products[] 
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
