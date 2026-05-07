import { SpotlightNavbar } from "../components/TestNavBar"

export function NavbarDemo() {
return (
  <div className="w-full relative h-[600px] flex items-center justify-center bg-transparent">
      <div className="absolute top-10">
          <SpotlightNavbar />
      </div>
  </div>
)
}