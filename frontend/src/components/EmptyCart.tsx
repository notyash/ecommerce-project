import { Link } from "@tanstack/react-router";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] gap-4 text-center">
            <div className="text-7xl">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500">Looks like you haven’t added anything yet.</p>
            <Link to="/products" className="mt-2 rounded-md bg-[#466EC3] px-5 py-2 text-white font-medium hover:bg-[#3b5da5] transition">
                Browse Products 
            </Link>
        </div>
    )
}