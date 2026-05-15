import NavBar from "../components/NavBar";
import { SignInForm } from "../components/LoginInForm";

export default function LoginPage() {
  return (
    <div>
        <NavBar></NavBar>
        <SignInForm></SignInForm>
        {/* <button className="border-black-300" onClick={googleLogin}>GOOGLE OAUTH</button> */}
    </div> 
  );
}