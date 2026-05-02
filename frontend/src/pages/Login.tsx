import { useNavigate } from "@tanstack/react-router";
import NavBar from "../components/NavBar";
import {useForm} from "react-hook-form"
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";


export default function LoginPage() {
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            console.log(codeResponse);
            const tokens = await fetch(
                'http://localhost:8000/auth/oauth', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({code: codeResponse.code}),
                });
            if (tokens.ok) {
                console.log(await tokens.json());
            } else {
                console.log("error")
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });
  return (
    <div>
        <button onClick={googleLogin}>GOOGLE OAUTH</button>
    </div>
  );

    // const {register, handleSubmit, formState: {errors}} = useForm({defaultValues:{username:"", password: ""}})
    // const navigate = useNavigate();
    
    // async function sign_up(formData:{username: string, password:string}) {
    //     const res = await fetch("http://127.0.0.1:8000/auth/signup",{
    //                         method: "POST",
    //                         headers: { "Content-Type": "application/json" },
    //                         body: JSON.stringify({"username": formData.username, "password": formData.password})})
    //     const data = await res.json()
    //     console.log(data)
    //     if (res.ok) {
    //     localStorage.setItem('token', data.access_token);
    //     navigate({to: "/"});
    //     }
    // }
    
    // return (
    //     <div className="pt-24">
    //         <NavBar />
    //         <form className="flex flex-col items-center justify-center " 
    //         onSubmit={handleSubmit(sign_up)}>
    //             <label className="m-2">Username</label>
    //             <input className="border border-black" {...register("username", {required: true, maxLength:10})}/>
    //             {errors.username && <p className="text-[#bf1650] mb-3">Field is required</p>}
    //             <label className="">Password</label>
    //             <input className="border border-black mb-3"{...register("password", {required: true, maxLength:10})}/>
    //             {errors.password && <p className="text-[#bf1650] mb-3">Field is required</p>}
    //             <input className="border border-black p-2" type="submit"/>
    //         </form>
    //     </div>
    // )
}