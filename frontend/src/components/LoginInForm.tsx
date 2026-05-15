import { useState } from "react";
import { useGoogleOAuthLogin } from "../hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/

export function SignInForm() {
    const {googleLogin, isPending, isError, error} = useGoogleOAuthLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
      <div className="relative">
        <img className="w-full h-screen object-cover" src="/sign_in_bg.jpg" alt="bg-image" />
        <hr className="absolute top-[89px] left-0 w-full border-t border-gray-500" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-[440px]">
            
            <h2 className="text-white text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

            <input
              type="email"
              value={email}
              placeholder="Email"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 mb-3 outline-none focus:border-white transition"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              value={password}
              placeholder="Password"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-white transition"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end mt-2 mb-6">
              <a onClick={() => navigate({to: "/forgotpassword"})} className="text-gray-400 text-sm hover:text-white transition">
                Forgot password?
              </a>
            </div>

            <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition">
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-gray-600" />
              <span className="text-gray-400 text-sm">or</span>
              <hr className="flex-1 border-gray-600" />
            </div>

            {/* Google button */}
            <div className="flex justify-center">
              <button
                onClick={() => googleLogin()}
                disabled={isPending}
                className="flex items-center justify-center bg-white w-10 h-10 rounded-full hover:bg-gray-100 transition"
              >
                <img src="/g-logo.png" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{" "}
              <a onClick={() => navigate({to: "/signup"})} className="text-white hover:underline">Sign up</a>
            </p>

          </div>
        </div>
      </div>
  );
}

  
