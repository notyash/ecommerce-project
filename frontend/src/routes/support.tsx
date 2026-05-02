import { createFileRoute } from '@tanstack/react-router'
import SupportPage from '../pages/Support'

export const Route = createFileRoute('/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SupportPage/>
}
