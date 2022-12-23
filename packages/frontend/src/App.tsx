import React from "react";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import theme from "./styles/theme";

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
