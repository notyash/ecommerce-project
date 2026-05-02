// import { createFileRoute, useNavigate } from '@tanstack/react-router'
// import { useEffect } from 'react'
// import { z } from 'zod'

// const callbackAuthSchema = z.object({
//   code: z.string(),
// })

// export const Route = createFileRoute('/auth/callback')({
//   component: RouteComponent,
//   validateSearch: callbackAuthSchema
// })

// function RouteComponent() {
//   const { code } = Route.useSearch()

//   useEffect(()=>{
//     (async () => {
//       const navigate = useNavigate();
//       const res = await fetch('http://127.0.0.1:8000/auth/oauth', {
//         body: JSON.stringify(code)
//       })


//     })()
//   }, [code])

//   return <div>Processing..</div>
// }
