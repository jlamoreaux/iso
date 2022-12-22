import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile";
import Root from "./routes/Root";
import { authTest, getPhotographer, logout } from "./services/api";
import theme from "./styles/theme";
import logoutLoader from "./utils/logoutLoader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "logout",
    loader: async () => await logoutLoader(),
    element: <Logout />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "authtest",
    loader: async () => {
      const response = await authTest();
      return response;
    },
  },
  {
    path: "/photographer/:id",
    loader: async ({ params }) => {
      const photographer = await getPhotographer(params.id);
      return photographer;
    },
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
);
