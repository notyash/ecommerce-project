import { useGoogleOAuthLogin } from "../utils/hooks";


export default function LoginPage() {
  const googleLogin = useGoogleOAuthLogin();
  return (
    <div>
        <button className="border-black-300" onClick={googleLogin}>GOOGLE OAUTH</button>
    </div> 
  );
}