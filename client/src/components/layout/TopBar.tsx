import { NavLink } from "react-router"
import { Button } from "../Button"

export const TopBar = () => {
    return (
        <div className="flex w-full h-fit justify-between px-3 py-2">
            <NavLink to='/'>
                <Button variant="ghost">Logo</Button>
            </NavLink>
            <div>
                <Button variant="ghost">Listings</Button>
                <Button variant="ghost">About us</Button>
            </div>
            <NavLink to={"/login"}><Button>Login</Button></NavLink>
        </div>
    )
}