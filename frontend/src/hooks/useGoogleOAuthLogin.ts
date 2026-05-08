import { useGoogleLogin } from "@react-oauth/google";
import { User } from "../types";
import { api } from "../utils/axios";

export function useGoogleOAuthLogin(){
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        scope: 'openid email profile',
        onSuccess: async (codeResponse) => {
                const response = await api.post('/api/auth/oauth',
                    { code: codeResponse.code}, 
                    { headers: {'Content-Type': 'application/json'}});
                const userDto: User = response.data;
                console.log(`${userDto.name} logged in!`)
        },
        onError: errorResponse => console.log(errorResponse),
    });
    return googleLogin
}
