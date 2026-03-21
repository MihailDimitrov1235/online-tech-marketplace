import { createBrowserRouter, Navigate, Outlet } from "react-router"

import { MainLayout, AuthLayout } from "@/layouts"

import Home from "@/pages/Home"
import Login from "@/pages/auth/Login"
import Register from "./pages/auth/Register"
import Page404 from "@/pages/Page404"
import Listings from "./pages/Listings"
import Dashboard from "./pages/Dashboard"
import MyListings from "./pages/MyListings"
import Detail from "./pages/Detail"
import Settings from "./pages/Settings"

function ProtectedRoute() {
  const token = localStorage.getItem("token")
  return token ? <Outlet /> : <Navigate to={paths.auth.login} replace />
}

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
          {
            index: true,
            element: <Listings />,
          },
          {
            path: ":id",
            element: <Detail />,
          },
        ],
      },
      {
        path: "my-listings",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <MyListings />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "settings",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
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
  myListings: "/my-listings",
}
