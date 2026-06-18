import { PaymentResult, } from "../components/PaymentResults"
import { useGetPaymentStatus } from "../hooks/usePayment"

const FAILED_COLOR = "text-red-900"

export default function PaymentResultPage({stripe_id}: {stripe_id?: string}) {
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


    switch (paymentStatus) { 
        case "succeeded":
            return <PaymentResult message="Payment successful."/>
            
        case "processing":
            return <PaymentResult message="Your payment is still processing."/>

        case "requires_payment_method":
            return <PaymentResult message="Payment failed. Please try another payment method." color={FAILED_COLOR} failed={true}/>

        case "requires_action":
            return <PaymentResult message="Your payment requires additional confirmation." color={FAILED_COLOR} failed={true}/>

        case "canceled":
            return <PaymentResult message="This payment was cancelled." color={FAILED_COLOR} failed={true}/>

        default:
            return <PaymentResult message={`Payment status: ${paymentStatus}`} color={FAILED_COLOR} failed={true}/>
    }
}