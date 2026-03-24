export type Products = {
  id?: string;
  title?: string;
  price?: string;
  category?: string;
  image?: string;
  description?: string;
  rating?: { rate: string; count: string };
  styles?: string
};

export type NavItem = {
  children: React.ReactNode;
  styles?: string;
};

export type FilteredData = {
  filter: string;
  setFilter?: (value: string) => void;
}