import { SignInForm } from "../components/LoginInForm";
import { NavBar } from "../components/NavBar";
export default function LoginPage() {
  return (
    <div>
        <NavBar/>
        <SignInForm></SignInForm>
        {/* <button className="border-black-300" onClick={googleLogin}>GOOGLE OAUTH</button> */}
    </div> 
  );
}