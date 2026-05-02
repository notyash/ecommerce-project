import { createFileRoute } from '@tanstack/react-router'
import CartPage from '../pages/Cart'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CartPage/>
}
