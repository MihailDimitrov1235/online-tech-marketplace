import { createBrowserRouter } from "react-router";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Page404 from "./pages/Page404";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />
      },
    ],
  },
  {
    path: "*",
    element: <Page404/>
  }
]);