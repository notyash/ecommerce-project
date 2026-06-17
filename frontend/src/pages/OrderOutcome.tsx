import { NavBar } from "../components/NavBar"
import { useGetPaymentStatus } from "../hooks/usePayment"

export default function OrderOutcome({stripe_id}: {stripe_id?: string}) {
    const {data: paymentStatus, error, refetch, isError, isLoading} = useGetPaymentStatus(stripe_id) 

    if (isLoading) return <div>Verifying your payment status...</div>
    if (isError) return (
        <div>
            <p>We couldn't verify your payment status.</p>
            <p>Please check your connection and try again.</p>

            <button onClick={() => refetch()}>
            Try again
            </button>

            {import.meta.env.DEV && ( // show error msg only when in dev mode
            <p>{error instanceof Error ? error.message : "Unknown error"}</p>)}
        </div>
    )

    if (!paymentStatus) return <div>The server returned an unexpected response. Your payment may still be processing.</div>

    let outcomeMessage: string

    switch (paymentStatus) { 
        case "succeeded":
            outcomeMessage = "Payment successful."
            break
        case "processing":
            outcomeMessage = "Your payment is still processing."
            break

        case "requires_payment_method":
            outcomeMessage = "Payment failed. Please try another payment method."
            break

        case "requires_action":
            outcomeMessage = "Your payment requires additional confirmation."
            break

        case "canceled":
            outcomeMessage = "This payment was cancelled."
            break

        default:
            outcomeMessage = `Payment status: ${paymentStatus}`

    }

    return (
        <div>
            <NavBar/>
            <div className="pt-20">
                {outcomeMessage}
            </div>
        </div>
    )
}