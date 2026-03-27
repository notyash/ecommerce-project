import { Link, useLocation } from "react-router";
import { NavItem as TNavItem } from "../types";

const active_style = "bg-[#466EC3] text-white font-bold"
const sign_in_styles = "bg-[#466EC3] border border-[#14213D] absolute right-6 text-white"
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Developers", path: "/developers" },
  { label: "Support", path: "/support" },
  { label: "Contact", path: "/contact" },
  { label: "Sign In", path: "/sign-in", type: "auth" },
]

export function NavItem({ children, styles = ""}: TNavItem) {
    return (
        <div className={`rounded-lg p-3 m-1 hover:shadow-md hover:shadow-[#14213D]/50
                 hover:bg-[#466EC3] text-white font-bold transition-all duration-500 ${styles}`}>
            {children}
        </div>
    )
    } 

export default function NavBar() {
    const {pathname} = useLocation();
    return (
        <nav className="fixed top-0 left-0 w-full z-10 bg-black">
            <Link to={"/"}><img src="/xre_logo.png" className="mt-1 absolute left-6 h-20 w-auto" /></Link>
            <div className="flex justify-center gap-8 p-4">
                {navItems.map((item) => 
                <Link to={item.path} key={item.path}>
                    <NavItem styles={item.type === "auth" ? sign_in_styles : pathname === item.path ? active_style : ''}>{item.label}</NavItem>
                </Link>
                )}
            </div>
        </nav>
    )
}
