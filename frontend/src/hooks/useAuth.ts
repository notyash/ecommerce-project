import { useQuery, useQueryClient } from "@tanstack/react-query"
import { User } from "../types/user"
import { api } from "../utils/axios"
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

export function useGetUser() {
    const {isLoading, error, data, isError} = useQuery<User>({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await api.get('/auth/me')
            return response.data
        },
        retry: false,
    })
    return {
        isLoading,
        isError,
        data,
        error
    }
}

export function useLogout() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const logoutMutation = useMutation({
        mutationFn: async () => {
            try {
                const res = await api.post("/auth/logout")
                return res.data
            } catch {
                throw new Error("Logout failed!")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['me']})
            navigate({to: "/login"})
        },
    })

    return logoutMutation
}

export function useGoogleOAuthLogin(){
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const oauthMutation = useMutation({
        mutationFn: async (code: string) => {
            try {
                const res = await api.post("/auth/oauth", { code })
                return res.data as User
            } catch {
                throw new Error("Google login failed. Please try again.")
            }
        },
        onSuccess: (user) => {
            console.log(`${user.name} logged in!`)
            queryClient.invalidateQueries({queryKey: ['me']})
            navigate({to: "/"})
        }
    })
    
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        scope: 'openid email profile',
        onSuccess: (codeResponse) => {
            oauthMutation.mutate(codeResponse.code)
        }
    });

    return {
        googleLogin,
        isPending: oauthMutation.isPending,
        isError: oauthMutation.isError,
        error: oauthMutation.error
    }
}
