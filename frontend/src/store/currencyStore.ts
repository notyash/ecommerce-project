import { create } from 'zustand'
import { Currency } from '../types/payment'

type CurrencyStore = {
    currency: Currency,
    changeCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
    currency: "inr",
    changeCurrency: (currency) => set({currency}),
}))
