import { useLocation, Link } from '@tanstack/react-router'
import SearchBar from './SearchBar';
import { useGetUser, useLogout } from '../hooks/useAuth';
import Profile from './Profile';
import CurrencyDropdown from './CurrencyDropdown';
import { useCurrencyStore } from '../store/currencyStore';

const navItemStyles = "flex items-center justify-center h-11 font-bold rounded-md p-3 hover:bg-[#466EC3] hover:text-white transition-all duration-500"

function getNavClass(currentPath: string, linkPath: string) {
    const isActive = linkPath === currentPath
    return `${navItemStyles} ${isActive ? "text-[#466EC3]" : "text-white"}`
}

export function NavBar() {
    const {pathname} = useLocation()
    const {user, isLoading} = useGetUser()
    const currentImage = pathname === "/" ? "/blue_xre_logo.png" : "/xre_logo.png"
    const logoutMutation = useLogout()
    const currency = useCurrencyStore((state) => state.currency);
    const changeCurrency = useCurrencyStore((state) => state.changeCurrency); 
    const changeSymbol= useCurrencyStore((state) => state.changeCurrencySymbol); 

    function AuthButton() {
        if (isLoading) { return null }
        if (user) { return <button onClick={() => logoutMutation.mutate()} className={`${navItemStyles} text-red-900`}> Logout </button> } 
        return <Link to="/login" className={getNavClass(pathname, "/login")}>Login</Link>
    }

    return (
        <nav className='fixed top-0 left-0 z-50 w-full  bg-black shadow-sm shadow-neutral-500'>
            <div className={`flex h-20 items-center justify-center gap-4 px-4`}>
                {/* Logo */}
                <Link to="/"><img src={currentImage} className="h-16" /></Link>  
                <SearchBar/>
                {/* Products */}
                <Link to="/products" search={(prev) => ({...prev, query: ""})} className={getNavClass(pathname, '/products')}>
                    Products
                </Link>
                {/* Cart */}
                <Link to='/cart' className={getNavClass(pathname, '/cart')}>
                    🛒 Cart
                </Link>
                {/* Support */}
                <Link to="/support" className={getNavClass(pathname, '/support')}>
                    Support
                </Link>
                {/* Profile */}
                {user && <Profile navclass={getNavClass(pathname, '/profile')}/>}

                {/* Currency Dropdown */}
                {["/", "/cart", "/products", "/profile"].includes(pathname) && <CurrencyDropdown currency={currency} onCurrencyChange={changeCurrency} onSymbolChange={changeSymbol}/>}

                {/* Login / Logout */}
                {<AuthButton/>}
            </div>
        </nav>
    )
}
