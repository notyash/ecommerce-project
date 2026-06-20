import { createFileRoute } from '@tanstack/react-router'
import PaymentResultPage from '../pages/PaymentResult'
import { NavBar } from '../components/NavBar'

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
  return (
    <div>
      <NavBar/>
      <div className='pt-20'>
        <PaymentResultPage stripe_id={search.payment_intent}/>
      </div>
    </div>
    )
  }
