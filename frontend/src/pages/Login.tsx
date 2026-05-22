import { SignInForm } from "../components/LoginInForm";
import { useGoogleOAuthLogin } from "../hooks/useGoogleOAuthLogin";
import { NavBar } from "../components/NavBar";

export default function LoginPage() {
  const googleLogin = useGoogleOAuthLogin();
  return (
    <div>
        <NavBar/>
        <SignInForm></SignInForm>
        {/* <button className="border-black-300" onClick={googleLogin}>GOOGLE OAUTH</button> */}
    </div> 
  );
}