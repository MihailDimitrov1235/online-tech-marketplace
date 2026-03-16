import { createBrowserRouter } from "react-router";

import { MainLayout, AuthLayout } from "@/components/layout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
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