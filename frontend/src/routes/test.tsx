import { createFileRoute } from '@tanstack/react-router'
import {NavbarDemo} from '../pages/Test'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NavbarDemo/>
}
