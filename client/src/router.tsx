import { createBrowserRouter } from "react-router";

import { MainLayout, AuthLayout } from "@/components/layout";

import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "./pages/auth/Register";
import Page404 from "@/pages/Page404";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
  {
    path: "*",
    element: <Page404 />
  }
]);

export const paths = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  }
}