import NavBar  from "../components/NavBar";
import { FilterMenu } from "../components/FilterMenu";
import { useGetData } from "../utils/hooks";


export default function ProductsPage() {
    const {productData, isError} = useGetData();

    if (isError) return <div>Unable to retrieve products!</div>
    if (!productData) return null

    return (
        <>
        <NavBar />
        <FilterMenu productData={productData}></FilterMenu>
        </>

    )
}