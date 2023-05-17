import React from "react";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.js";
import theme from "./styles/theme.js";
import AuthProvider from "./context/AuthProvider.js";

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
