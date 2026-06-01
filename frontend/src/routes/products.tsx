import { createFileRoute} from '@tanstack/react-router'
import ProductsPage from '../pages/Products'



export const Route = createFileRoute('/products')({
  validateSearch: (search: Record<string, unknown>) => {
    return {query: (search.query) ?? ""}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <ProductsPage query={search.query as string}/>
}
