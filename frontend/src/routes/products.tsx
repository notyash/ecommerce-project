import { createFileRoute} from '@tanstack/react-router'
import ProductsPage from '../pages/Products'

type ProductSearch = {
  query?: string;
};

export const Route = createFileRoute('/products')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    if (typeof search.query === "string") {
      return { query: search.query };
    }

    return {};
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch()
  return <ProductsPage query={search.query ?? ""}/>
}
