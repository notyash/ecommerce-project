import { create } from 'zustand'

type PaymentValidation = {
    payment_invalidated: boolean,
    updateValidation: (payment_validation: boolean) => void
}

export const useCheckPaymentValidation = create<PaymentValidation>((set) => ({
        payment_invalidated: false,
        updateValidation: (payment_validation: boolean) => set({payment_invalidated: payment_validation}),
    }))
