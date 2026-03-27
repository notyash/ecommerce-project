export type Products = {
  id: string;
  title: string;
  price?: string;
  category?: string;
  image?: string;
  description?: string;
  rating?: { rate: string; count: string };
  styles?: string;
  quantity: number;
};

export type NavItem = {
  children: React.ReactNode;
  styles?: string;
};

export type FilteredData = {
  filter: string;
  setFilter?: (value: string) => void;
}

export type CartAction =  { type: 'ADD_ITEM'; payload: Products } | 
                          { type: 'REMOVE_ITEM'; payload: { id: string } } | 
                          { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } } |
                          { type: 'CLEAR_CART' }
