import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '../pages/Products'

export const Route = createFileRoute('/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductsPage/>
}
