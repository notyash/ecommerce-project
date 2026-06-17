import { createFileRoute } from '@tanstack/react-router'
import OrderOutcome from '../pages/OrderOutcome'

type PaymentResultSearch = {
  payment_intent?: string
}

export const Route = createFileRoute('/orderoutcome')({
  validateSearch: (search: Record<string, unknown>): PaymentResultSearch => {
    if (typeof search.payment_intent === "string") {
      return {payment_intent: search.payment_intent}
    }
    return {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <OrderOutcome stripe_id={search.payment_intent}/>
  }
