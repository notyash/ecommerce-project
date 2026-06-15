import { useState } from "react";
import { Currency, CurrencyDropdownProps } from "../types/payment";

export default function CurrencyDropdown({ // understood and made changes to code given by AI
  currency,
  onChange,
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = {
    inr: {
      symbol: "₹",
      code: "INR",
    },
    usd: {
      symbol: "$",
      code: "USD",
    },
  };

  const selected = options[currency];

  const handleSelect = (newCurrency: Currency) => {
    onChange(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="
          flex h-11 items-center justify-between
          rounded-md text-white
          bg-gray-900 px-4 py-2
          text-left shadow-sm
          transition duration-300
          hover:shadow-sm hover:shadow-gray-700
        "
      >
        <div className="flex items-center gap-3">
            <span className="text-lg">{selected.symbol}</span>
            <p className="text-sm font-bold text-white">{selected.code}</p>
            <span className={`text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </div>

      </button>

      <div className={`absolute right-0 z-50 mt-2 w-full origin-top rounded-lg border border-gray-200 bg-white p-1 shadow-lg transition-all duration-200 
        ${isOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-95 opacity-0"}`}>
        {(Object.keys(options) as Currency[]).map((option) => {
          const item = options[option];
          const isSelected = currency === option;

          return (
            <button key={option} type="button" onClick={() => handleSelect(option)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition duration-150
                    ${isSelected ? "bg-blue-50 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>

              <span className="text-lg">{item.symbol}</span>
              <div>
                <p className="text-sm font-semibold">{item.code}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}