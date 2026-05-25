import { useLocation, useNavigate } from "@tanstack/react-router"
import { useRef } from "react"

export default function SearchBar() {
    const navigate = useNavigate()
    const queryRef = useRef<HTMLInputElement>(null)
    const {pathname} = useLocation()
    const liveQuery = pathname === "/products" ? true : false

    function searchHandler() {
        if (!queryRef.current!.value) { return null }
        return navigate({to: "/products", replace: liveQuery, search: {query: queryRef.current!.value}})
    }

    return (
    <form className={`flex w-[700px] `}
          onSubmit={(e) => {e.preventDefault() 
                            liveQuery ?  null : searchHandler()}}>
        <input ref={queryRef} onChange={liveQuery ? searchHandler : () => null} className='flex-1 px-2 h-9 rounded-l placeholder-black focus:outline-none' type="search" placeholder='Search'/>
        <button className='flex items-center justify-center rounded-r h-9 w-9 bg-[#466EC3]'>
            <img src="/icons8-search.png" alt="" className='w-6 h-6'/>
        </button>
    </form>
    )   
}
