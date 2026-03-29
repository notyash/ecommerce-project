import { Products } from "../types";


export function ProductsInCart({data} : {data?: Products}){
    return (
        <div className="grid grid-cols-[auto,1fr] pt-24">
            {data?.title}
            {/* <div className="mx-auto">
                {data}
            </div>
            <div className="">
                hi
            </div> */}
        </div>
    )
}