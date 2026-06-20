import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Stripe, StripeAddressElementOptions, StripePaymentElementOptions } from "@stripe/stripe-js";

const paymentElementOptions: StripePaymentElementOptions = {
  layout: {
      type: "tabs",
      defaultCollapsed: true,
  }, 
  paymentMethodOrder: ["upi", "google_pay", "amazon_pay",]
}

const addressElementOptions: StripeAddressElementOptions = {
  mode: "shipping",
  defaultValues: {
    name: "Yash Dahapute",
    address: {
        line1: "The White House",
        line2: "Groove Street",
        city: "Amravati",
        state: "Maharashtra",
        postal_code: "696969",
        country: "IN",
    }
  }
}

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  async function getAddress() {
    if (!stripe || !elements) return;

    const addressElement = elements.getElement("address")
    if (!addressElement) return
    const {complete, value} = await addressElement.getValue()
    
    if (!complete) {
      console.log("Address is incomplete!")
      return
    }
    return value
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:5173/orderoutcome" },
    });

    const address = await getAddress()
    console.log(address)

    if (error) console.log(error.message);
  }

  return (
    <form className="flex flex-cols gap-14 w-full justify-center mt-16" onSubmit={handleSubmit}>

      <div className="bg-white h-fit p-3">
        <AddressElement options={addressElementOptions}/>
      </div>

      <div className="bg-white h-fit p-3">
        <PaymentElement options={paymentElementOptions} />
      </div>

      <ReviewAndSubmit stripe={stripe}/>
    </form>
  );
}

function ReviewAndSubmit({stripe}: {stripe: Stripe | null}) {
  return (
    <div>
      <button className="bg-[#456EC3] p-2 rounded-md text-white hover:bg-blue-500 transition-all duration-500 w-fit"
       disabled={!stripe}>Use this payment method</button>
    </div>
  )
}
