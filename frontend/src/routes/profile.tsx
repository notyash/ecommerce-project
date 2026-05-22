import { createFileRoute } from '@tanstack/react-router'
import { NavBar } from '../components/NavBar'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NavBar/>
}
