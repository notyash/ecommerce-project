import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Currency, PaymentIntent, PaymentIntentStatus } from "../types/payment"
import { api } from "../utils/axios"

export function useCheckoutCart() {
    const checkoutMutation = useMutation({
        mutationFn: async (currency: Currency) => {
            try {
                const res = await api.post("/payment/stripe", { currency })
                return res.data as PaymentIntent
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Stripe backend error:", error.response?.data)
        
                    throw new Error(
                        error.response?.data || "Unable to retrieve client_secret from Stripe!"
                    )
                }
                throw error
            }
        },
        onSuccess: () => {
            console.log(`Successfully retrieved client_secret`)
        }
    })

    return checkoutMutation
}

export function useGetPaymentStatus(stripe_id?: string) {
    return useQuery<PaymentIntentStatus>({
        queryKey: ['paymentStatus', stripe_id],
        queryFn: async () => {
            const res = await api.get("/payment/status", {
                params: {stripe_id}
            })

            return res.data
        },
        enabled: !!stripe_id
    })

}