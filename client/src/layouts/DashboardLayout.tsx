import { Outlet } from "react-router"

import Header from "@/components/dashboard/Header"
import Sidebar from "@/components/dashboard/Sidebar"

export default function DashboardLayout() {
  return (
    <div className="flex-1 flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col w-full">
        <Header />

        <Outlet />
      </div>
    </div>
  )
}
