import { useLocation, Link } from '@tanstack/react-router'
import SearchBar from './SearchBar';

const activeStyle = "bg-[#466EC3]"
const navItemStyles = "flex items-center justify-center h-11 text-white font-bold rounded p-3 hover:bg-[#466EC3] transition-all duration-500"

function getNavClass(currentPath: string, linkPath: string) {
    return `${navItemStyles} ${linkPath === currentPath ? activeStyle : ""}`
}

export function NavBar() {
    const {pathname} = useLocation()
    const currentImage = pathname === "/" ? "/blue_xre_logo.png" : "/xre_logo.png"
    return (
        <nav className='fixed top-0 left-0 z-50 w-full  bg-black shadow-sm shadow-neutral-500'>
            <div className={`flex h-20 items-center justify-center gap-4 px-4`}>
                {/* Logo */}
                <Link to={"/"}><img src={currentImage} className="h-16" /></Link>  
                <SearchBar/>
                {/* Cart */}
                <Link to='/cart' className={getNavClass(pathname, '/cart')}>
                    🛒 Cart
                </Link>
                {/* Support */}
                <Link to="/support" className={getNavClass(pathname, '/support')}>
                    Support
                </Link>
                {/* Profile */}
                <Link to="/profile" className={getNavClass(pathname, "/profile")}>
                    Profile
                </Link>
                {/* Sign In */}
                <Link to="/login" className={getNavClass(pathname, "/login")}>
                    Sign In
                </Link>
            </div>
        </nav>
    )
}
