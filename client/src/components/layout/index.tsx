import { Outlet } from "react-router";
import { TopBar } from "./TopBar";

export default function Layout() {
  return (
    <div className="flex flex-col w-full min-h-screen">
        <TopBar/>
        <div className="flex-1 flex">
          <Outlet/>
        </div>
    </div>
  )
}
