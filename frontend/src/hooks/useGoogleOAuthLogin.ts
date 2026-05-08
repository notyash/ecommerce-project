import { useGoogleLogin } from "@react-oauth/google";
import { User } from "../types";


export function useGoogleOAuthLogin(){
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        scope: 'openid email profile',
        onSuccess: async (codeResponse) => {
            try {
                const response = await fetch('/api/auth/oauth', {
                    headers: {'Content-Type': 'application/json',},
                    method: 'POST',
                    body: JSON.stringify({code: codeResponse.code}),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Backend authentication failed');
                }
                const userDto: User = await response.json();
                console.log(`Logged in as: ${userDto.name} ${userDto}`)
            } catch (err) {
                console.error("Server-side login error:", err);
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });
    return googleLogin
}
