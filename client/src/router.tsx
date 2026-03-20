import { createBrowserRouter } from "react-router"

import { MainLayout, AuthLayout } from "@/layouts"

import Home from "@/pages/Home"
import Login from "@/pages/auth/Login"
import Register from "./pages/auth/Register"
import Page404 from "@/pages/Page404"
import Listings from "./pages/Listings"
import Dashboard from "./pages/Dashboard"
import MyListings from "./pages/MyListings"
import Profile from "./pages/Profile"
import Detail from "./pages/Detail"

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
        children: [
          {
            index: true,
            element: <MyListings />,
          },
        ],
      },
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: <Profile />,
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
  profile: "/profile",
  listings: "/listings",
  dashboard: "/dashboard",
  myListings: "/my-listings",
}
