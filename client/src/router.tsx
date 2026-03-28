import { createBrowserRouter, Outlet } from "react-router"

import { MainLayout, AuthLayout } from "@/layouts"
import { GuestGuard, AuthGuard } from "@/guards"

import Home from "@/pages/Home"
import Login from "@/pages/auth/Login"
import Register from "./pages/auth/Register"
import Page404 from "@/pages/Page404"
import Listings from "./pages/listings/Listings"
import Dashboard from "./pages/Dashboard"
import Detail from "./pages/listings/Detail"
import Settings from "./pages/Settings"
import NewListing from "./pages/listings/NewListing"
import EditListing from "./pages/listings/EditListing"
import DashboardLayout from "./layouts/DashboardLayout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "listings",
        children: [
          { index: true, element: <Listings /> },
          { path: "new", element: <NewListing /> },
          { path: "edit/:id", element: <EditListing /> },
          { path: ":id", element: <Detail /> },
        ],
      },
      {
        element: <AuthGuard><Outlet /></AuthGuard>,
        children: [
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    element: <AuthGuard><DashboardLayout /></AuthGuard>,
    children: [
      { index: true, element: <Dashboard /> }
    ]
  },
  {
    path: "auth",
    element: <GuestGuard><AuthLayout /></GuestGuard>,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <Page404 />,
  },
])

export const paths = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  settings: "/settings",
  listings: "/listings",
  dashboard: "/dashboard",
}
