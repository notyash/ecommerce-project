import { useQuery } from "@tanstack/react-query"
import { User } from "../types"
import { api } from "../utils/axios"
import { AxiosError } from "axios"

async function fetchMe() {
    try {
        const response = await api.get('api/auth/me')
        return response.data
    } catch (e) {
        if (e instanceof AxiosError) {
            console.error('Error response:', e.response?.data);
        } else {
            console.error('Unexpected error:', e);
        }
        throw new Error('Login failed');
    }
}

export function useGetUser() {
    return useQuery<User, Error>({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false,
    })
}
