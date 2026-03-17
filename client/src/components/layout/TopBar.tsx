import { NavLink } from "react-router"

import { paths } from "@/router";

import { Button } from "../common/Button"
import { Logo } from "../common/Logo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export const TopBar = () => {
  
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  return (
    <div className="flex w-full items-center justify-between px-6 py-3 border-b border-neutral/40 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <Logo />

      <nav className="flex items-center gap-1">
        <Button variant="ghost" size="sm">Listings</Button>
        <Button variant="ghost" size="sm">About us</Button>
      </nav>

      <div>
        { token? 
          <div>
            <NavLink to={paths.profile}>
              <Button size="sm">Profile</Button>
            </NavLink> 
            <Button size="sm" onClick={() => {dispatch(logout())}}>Logout</Button>
          </div>
        : 
        <NavLink to={paths.auth.login}>
          <Button size="sm">Login</Button>
        </NavLink>}
        
      </div>
      
    </div>
  )
}