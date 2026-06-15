export type PaymentIntent = {
  id: string,
  client_secret: string,
  status: string
}

export type Currency = "inr" | "usd";

export type CurrencyDropdownProps = {
  currency: Currency;
  onChange: (currency: Currency) => void;
};