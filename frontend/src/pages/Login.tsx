import NavBar from "../components/NavBar";
import { SignInForm } from "../components/LoginInForm";
import { useGoogleOAuthLogin } from "../hooks/useGoogleOAuthLogin";

export default function LoginPage() {
  const googleLogin = useGoogleOAuthLogin();
  return (
    <div>
        <NavBar></NavBar>
        <SignInForm></SignInForm>
        {/* <button className="border-black-300" onClick={googleLogin}>GOOGLE OAUTH</button> */}
    </div> 
  );
}