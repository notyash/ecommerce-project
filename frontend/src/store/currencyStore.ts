import { create } from 'zustand'
import { Currency, CurrencySymbol } from '../types/payment'
import { persist } from "zustand/middleware";

type CurrencyStore = {
    currency: Currency,
    symbol: CurrencySymbol,
    changeCurrency: (currency: Currency) => void,
    changeCurrencySymbol: (symbol: CurrencySymbol) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
    persist (
        (set) => ({
        currency: "inr",
        symbol: "₹",
        changeCurrency: (currency) => set({currency}),
        changeCurrencySymbol: (symbol) => set({symbol}),
        }),
        {
            name: "currency-store"
        }
    )
)
