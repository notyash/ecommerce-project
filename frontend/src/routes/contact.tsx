import { createFileRoute } from '@tanstack/react-router'
import ContactsPage from '../pages/Contact'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactsPage/>
}
