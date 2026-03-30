


const categories = [
    {label: "men's clothing", display_name: "Men's Clothing"},
    {label: "women's clothing", display_name: "Women's Clothing"},
    {label: "jewelery", display_name: "Jewelry"},
    {label: "electronics", display_name: "Electronics"}
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
