export type PaymentIntent = {
  id: string,
  client_secret: string,
  status: string
}

export type Currency = "inr" | "usd";
export type CurrencySymbol = "₹" | "$";

export type CurrencyDropdownProps = {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onSymbolChange: (symbol: CurrencySymbol) => void;
};