import ReactDOM from "react-dom/client";
import "./index.css";
import { queryClient } from "./utils/queryClient";
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const rootElement = document.getElementById('root')!

ReactDOM.createRoot(rootElement).render(
    <RouterProvider router={router}/>
);
