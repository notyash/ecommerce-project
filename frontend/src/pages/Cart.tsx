import { ProductsInCart } from "../components/CartMenu";
import NavBar from "../components/NavBar";
import { useGetDataById } from "../utils/hooks";

export default function CartPage() {
    const {productData, isError} = useGetDataById(25);
    if (isError) return <div>Unable to retrieve products!</div>
    if (!productData) return null
    return (
        <div>
            <NavBar />
            <ProductsInCart data={productData}/>
        </div>  
    )
}