
export default function SearchBar({query, setQuery}: {query: string, setQuery: React.Dispatch<React.SetStateAction<string>>}) {
    
    return (
    <div className={`flex w-[700px] `}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} className='flex-1 px-2 h-9 rounded-l placeholder-black focus:outline-none' type="search" placeholder='Search'/>
        <button className='flex items-center justify-center rounded-r h-9 w-9 bg-[#466EC3]'>
            <img src="/icons8-search.png" alt="" className='w-6 h-6'/>
        </button>
    </div>
    )   
}
