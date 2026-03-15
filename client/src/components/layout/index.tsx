import { Outlet } from "react-router";
import { TopBar } from "./TopBar";

export default function Layout() {
  return (
    <div className="flex flex-col w-full h-fit">
        <TopBar/>
        <Outlet/>
    </div>
  )
}
