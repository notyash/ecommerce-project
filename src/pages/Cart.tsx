import NavBar from "../components/NavBar";
import { ProductsInCart } from "../components/ProductsInCart";
import { useGetDataById } from "../utils/hooks";

export default function CartPage() {
    const {productData, isError} = useGetDataById('1');
    console.log(productData)
    if (isError) return <div>Unable to retrieve products!</div>
    if (!productData) return null
    return (
        <div>
            <NavBar />
            <ProductsInCart data={productData}/>
        </div>  
    )
}