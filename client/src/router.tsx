import { createBrowserRouter, Outlet } from "react-router"

import { MainLayout, AuthLayout, DashboardLayout } from "@/layouts"
import { GuestGuard, AuthGuard } from "@/guards"

import Home from "@/pages/Home"
import Login from "@/pages/auth/Login"
import Register from "./pages/auth/Register"
import Page404 from "@/pages/Page404"
import Listings from "./pages/listings/Listings"
import Detail from "./pages/listings/Detail"
import Settings from "./pages/Settings"
import NewListing from "./pages/listings/NewListing"
import EditListing from "./pages/listings/EditListing"

import Dashboard from "./pages/Dashboard"
import MyListings from "./pages/dashboard/MyListings"
import Orders from "./pages/dashboard/Orders"
import Deliveries from "./pages/dashboard/Deliveries"
import Cart from "./pages/Cart"
import MyOrders from "./pages/orders/MyOrders"
import Order from "./pages/orders/Order"
import Checkout from "./pages/Checkout"
import Data from "./pages/dashboard/Data"
import Verification from "./pages/dashboard/Verification"
import UsersData from "./pages/dashboard/Data/UsersData"
import ListingsData from "./pages/dashboard/Data/ListingsData"

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
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { path: "settings", element: <Settings /> },
          {
            path: "cart",
            children: [
              { index: true, element: <Cart /> },
              { path: "checkout", element: <Checkout /> },
            ],
          },
          {
            path: "orders",
            children: [
              { index: true, element: <MyOrders /> },
              { path: ":id", element: <Order /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "my-listings",
        element: <Outlet />,
        children: [
          { index: true, element: <MyListings /> },
          { path: "new", element: <NewListing /> },
          { path: "edit/:id", element: <EditListing /> },
          { path: ":id", element: <Detail /> },
        ],
      },
      { path: "orders", element: <Orders /> },
      { path: "deliveries", element: <Deliveries /> },
      {
        path: "data",
        element: <Data />,
        children: [
          { path: "users", element: <UsersData /> },
          { path: "listings", element: <ListingsData /> },
        ],
      },
      { path: "verifications", element: <Verification /> },
    ],
  },
  {
    path: "auth",
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
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
  listings: {
    root: "/listings",
    details: (id: string) => `/listings/${id}`,
  },
  orders: {
    root: "/orders",
    details: (id: string) => `/orders/${id}`,
  },
  cart: {
    root: "/cart",
    checkout: "/cart/checkout",
  },
  dashboard: {
    root: "/dashboard",
    myListings: {
      root: "/dashboard/my-listings",
      new: "/dashboard/my-listings/new",
      details: (id: string) => `/dashboard/my-listings/${id}`,
      edit: (id: string) => `/dashboard/my-listings/edit/${id}`,
    },
    orders: {
      root: "/dashboard/orders",
    },
    deliveries: {
      root: "/dashboard/deliveries",
    },
    data: {
      root: "/dashboard/data",
      dataType: (dataType: string) => `/dashboard/data/${dataType}`,
    },
    verifications: {
      root: "/dashboard/verifications",
    },
  },
}
