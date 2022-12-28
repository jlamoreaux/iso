import React from "react";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import theme from "./styles/theme";
import AuthProvider from "./context/AuthProvider";

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  );
};

export default App;
