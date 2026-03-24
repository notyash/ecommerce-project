import { Link, useLocation } from "react-router";
import { NavItem as TNavItem } from "../types";

export function NavItem({ children, styles = ""}: TNavItem) {
    return (
        <li
            className={`border border-black rounded-lg p-3 m-1 hover:shadow-md hover:shadow-black/50 transition-shadow duration-30
                 hover:bg-[#463F3A] hover:text-white transition-all duration-500 ${styles}`}>
            {children}
        </li>
    )
    } 

export default function NavBar() {
    const {pathname} = useLocation();
    const active_style = "bg-[#463F3A] text-white"
    return (
        <nav className="fixed top-0 left-0 w-full z-10 0 bg-[#E0AFA0]">
        <Link to={"/"}><img src="src/images/Pi7_xre_logo.png" className="mt-1 absolute left-6 h-20 w-auto"></img></Link>
        <ul className="flex justify-center  items-center gap-8 p-4">
            <div className="flex gap-8">
            <Link to="/"><NavItem styles={pathname == "/" ? active_style: ''}>Home</NavItem></Link>
            <Link to="/products"><NavItem styles={pathname == "/products" ? active_style: ''}>Products</NavItem></Link>
            <NavItem>Developers</NavItem>
            <NavItem>Support</NavItem>
            <NavItem>Contact</NavItem>
            </div>  
            <div className="absolute right-6"> 
            <NavItem styles="text-white bg-[#463F3A] hover:text-white">
                Sign In
            </NavItem>
            </div>
        </ul>
        </nav>
    )
}
