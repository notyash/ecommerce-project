import { useLocation, Link, useNavigate } from '@tanstack/react-router'
import { NavItem as TNavItem } from "../types/cart";
import { useState } from 'react';
import SearchBar from './SearchBar';

const active_style = "bg-[#466EC3] text-white font-bold"
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "🛒 Cart", path: "/cart" },
  { label: "Support", path: "/support" },
  { label: "Contact", path: "/contact" },
  { label: "Sign In", path: "/login", type: "auth", first_render: false },
//   { label: "Test", path: "/test"},
]

// export function NavItem({ children, styles = "", path}: TNavItem) {
//     const base = `rounded-lg p-3 m-1 hover:shadow-md hover:shadow-[#14213D]/50 
//                   hover:bg-[#466EC3] text-white font-bold transition-all duration-500 ${styles}`;
//     return (
//         <div className={`${base} ${path === "/sign-in" ? "absolute right-6" : ""}`}>
//             {children}
//         </div>
//     )
// } 

// export default function NewNavBar() {
//     const {pathname} = useLocation();
//     return (
//         <nav className="fixed top-0 left-0 w-full z-10 bg-black">
//             <Link to={"/"}><img src="/xre_logo.png" className="mt-1 absolute left-6 h-20 w-auto" /></Link>
//             <div className="flex justify-center gap-8 p-4">
//                 {navItems.map((item) => 
//                 <Link to={item.path} key={item.path}>
//                     <NavItem path={item.path} styles={pathname === item.path ? active_style : ''}>{item.label}</NavItem>
//                 </Link>
//                 )}
//             </div>
//         </nav>
//     )
// }


export function NavBar() {
    const navigate = useNavigate()
    const navItemStyles = "flex items-center justify-center h-11 text-white font-bold rounded p-3 hover:bg-[#466EC3] transition-all duration-500"
    return (
        <nav className='fixed top-0 left-0 z-50 w-full  bg-black shadow-sm shadow-neutral-500'>
            <div className={`flex h-20 items-center justify-center gap-4 px-4`}>
                {/* Logo */}
                <Link to={"/"}><img src="/xre_logo.png" className="h-16" /></Link>  
                <SearchBar/>
                {/* Cart */}
                <div className={`${navItemStyles}`}>
                    🛒 Cart
                </div>
                {/* Support */}
                <div className={`${navItemStyles}`}>
                    Support
                </div>
                {/* Profile */}
                <div className={`${navItemStyles}`}>
                    Profile
                </div>
                {/* Sign In */}
                <div className={`bg-[#466EC3] ${navItemStyles}`}>
                    Sign In
                </div>
            </div>
        </nav>
    )
}
