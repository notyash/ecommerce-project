import React, { useState } from "react";
import { useGoogleOAuthLogin, useLogin } from "../hooks/useAuth";
import { Link } from "@tanstack/react-router";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/


export function SignInForm() {
    const {googleLogin, isPending} = useGoogleOAuthLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState({emailError: "", passwordError: ""})
    const loginMutation = useLogin()

    function validateForm() {
      let newError = {
        emailError: "",
        passwordError: "",
      }

      if (!email) { newError.emailError = "Email is required!" }
      else if (!emailRegex.test(email)) { newError.emailError = "Enter a valid email." }

      if (!password) { newError.passwordError = "Password is required!" }
      else if (!passwordRegex.test(password)) { newError.passwordError = "Password must be 8+ characters and include a number and special character!" }
      setError(newError) 
      return newError
    }

    function submitHandler(e: React.SyntheticEvent<HTMLFormElement>) {
      e.preventDefault()

      const validationErrors = validateForm()
      if (!validationErrors.emailError && !validationErrors.passwordError) {
        loginMutation.mutate({email, password})
      }
    }

    return (
      <form className="relative" onSubmit={submitHandler} noValidate>
        <img className="w-full h-screen object-cover" src="/sign_in_bg.jpg" alt="bg-image" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-[440px]">
            
            <h2 className="text-white text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

            <input
              type="email"
              value={email}
              placeholder="Email"
              className={`w-full bg-white/10 text-white placeholder-gray-400 border ${error.emailError ? "border-red-500" : "border-gray-600"} rounded-lg px-4 py-3 mb-2 outline-none focus:border-white transition`}
              onChange={(e) => setEmail(e.target.value)}/>

            {error.emailError && <p className="text-sm text-red-500 mb-2">{error.emailError}</p>}
            <div className="relative">
              <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              className={`w-full bg-white/10 text-white placeholder-gray-400 border ${error.passwordError ? "border-red-500" : "border-gray-600"} rounded-lg px-4 pr-10 py-3 outline-none focus:border-white transition`}
              onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">{showPassword ? "🙈" : "👁️"}</button>
            </div>

            {error.passwordError && <p className="text-sm text-red-500 mb-2">{error.passwordError}</p>}
            {loginMutation.isError && <p className="text-sm text-red-500 mb-2">User not found!</p>}

            <div className="flex justify-end mt-2 mb-6">
              <Link to="/forgotpassword" className="text-gray-400 text-sm hover:text-white transition">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-400"
            disabled={loginMutation.isPending }>
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
                type="button"
                onClick={() => googleLogin()}
                disabled={isPending}
                className="flex items-center justify-center bg-white w-10 h-10 rounded-full hover:bg-gray-100 transition"
              >
                <img src="/g-logo.png" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white hover:underline">Sign up</Link>
            </p>

          </div>
        </div>
      </form>
  );
}

  
