import { Link } from "@tanstack/react-router"

export function PaymentResult({message, color="text-green-900", failed=false}:{message: string, color?: string, failed?: boolean}) {
    return (
        <section className="flex flex-col items-center justify-center min-h-[700px] gap-6 text-center px-6">
            <div className={`text-5xl font-bold ${color}`}>
                {message}
            </div>
            {!failed && <Link to={"/products"}>
                <button className="bg-black text-[white] px-6 py-3 rounded-full hover:opacity-80">Keep Shopping </button>
            </Link>}

            {failed && <Link to={"/checkout"}>
                <button className="bg-black text-[white] px-6 py-3 rounded-full hover:opacity-80">Try again</button>
            </Link>}
        </section>

    )
}

