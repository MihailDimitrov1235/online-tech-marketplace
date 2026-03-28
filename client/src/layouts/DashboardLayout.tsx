import { Outlet } from "react-router"

import Header from "@/components/dashboard/Header"
import Sidebar from "@/components/dashboard/Sidebar"

export default function DashboardLayout() {
  return (
    <div className="flex-1 flex h-screen min-h-0">
      <Sidebar />

      <div className="flex flex-col w-full">
        <Header />

        <Outlet />
      </div>
    </div>
  )
}



