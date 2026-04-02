const categories = [
    {label: "beauty", display_name: "Beauty"},
    {label: "fragrances", display_name: "Fragrances"},
    {label: "furniture", display_name: "Furniture"},
    {label: "groceries", display_name: "Groceries"},
    {label: "home-decoration", display_name: "Home Decoration"},
    {label: "kitchen-accessories", display_name: "Kitchen Accessories"},
    {label: "laptops", display_name: "Laptops"},
    {label: "mens-shirt", display_name: "Mens Shirt"},
    {label: "mens-shoes", display_name: "Mens Shoes"},
    {label: "mens-watches", display_name: "Mens watches"},
    {label: "mobile-accessories", display_name: "Mobile Accessories"},
    {label: "motorcycle", display_name: "Motorcycle"},
    {label: "skin-care", display_name: "Skin Care"},
    {label: "smartphones", display_name: "Smartphones"},
    {label: "sports-accessories", display_name: "Sports Accessories"},
    {label: "sunglasses", display_name: "Sunglasses"},
    {label: "tablets", display_name: "Tablets"},
    {label: "tops", display_name: "Tops"},
    {label: "vehicle", display_name: "Vehicle"},
    {label: "womens-bags", display_name: "Womens Bags"},
    {label: "womens-dresses", display_name: "Womens Dresses"},
    {label: "womens-jewellery", display_name: "Womens Jewellery"},
    {label: "womens-shoes", display_name: "Womens Shoes"},
    {label: "womens-watches", display_name: "Womens Watches"},
]

export function FilterMenu({filter, setFilter}: {filter: string[], setFilter: (value: string[]) => void}) {

    function toggleFilter(category: string) {
        setFilter(filter.includes(category) ? filter.filter(item => item !== category) : [...filter, category])
    }

    return (
        <div className="flex flex-col w-64 sticky top-24 h-screen shrink-0 gap-1 pt-4 ml-5 bg-[#F1F3F6] shadow-md">
            <h1 className="font-semibold pl-6 text-xl">Filters</h1>
            <hr className="mx-auto border-gray-300 my-3 w-56 mt-4 mb-4"></hr>
            <h2 className="font-semibold mb-3 pl-6">Categories:</h2>
            {categories.map(category => <label key={category.label} className="accent-[#466EC3] p-1 pl-6"><input type="checkbox" checked={
            filter.includes(category.label)} onChange={() => toggleFilter(category.label)}/> {category.display_name}</label>)}
        </div>
    )
}
