import { Link } from "@tanstack/react-router";
import { useGetUser } from "../hooks/useAuth";

export default function Profile({navclass} : {navclass: string}) {
    const {user} = useGetUser()
    return (
    <Link to="/profile" className={navclass}>
        {user?.name}
    </Link>
    )
}