import { SignInForm } from "../components/SignInForm";
import { useGoogleOAuthLogin } from "../hooks/useGoogleOAuthLogin";

export default function LoginPage() {
  const googleLogin = useGoogleOAuthLogin();
  return (
    <div>
        <SignInForm></SignInForm>
        {/* <button className="border-black-300" onClick={googleLogin}>GOOGLE OAUTH</button> */}
    </div> 
  );
}