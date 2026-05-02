import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../main'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="219274718558-rc7ebds5vl9alhokro3arohi3ol6cmll.apps.googleusercontent.com">
          <Outlet />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
}