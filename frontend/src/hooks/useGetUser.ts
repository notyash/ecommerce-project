import { useQuery } from "@tanstack/react-query"
import { User } from "../types"

async function fetchMe() {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (!res.ok) throw new Error('Not authenticated')
    return res.json()
}

export function useGetUser() {
    return useQuery<User>({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false
    })
}
