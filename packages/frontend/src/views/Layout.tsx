import React from "react";
import { Outlet } from "react-router-dom";
import { AppShell, Footer, Header, Space, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import MobileNavBar from "../components/nav/MobileNav.ts";
import NavBar from "../components/nav/NavBar.ts";

const Layout: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 400px)");

  return (
    <AppShell
      padding={0}
      styles={{
        main: {
          width: "100vw",
        },
      }}
      navbar={
        <NavBar p="md" hiddenBreakpoint="md" width={{ sm: 200, lg: 300 }} hidden={isMobile} />
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="sm">
          <Title>ISO</Title>
        </Header>
      }
      footer={
        <Footer height="auto" position={{ bottom: 0 }} hidden={!isMobile}>
          <MobileNavBar />
        </Footer>
      }
    >
      <Outlet />
      <Space h={isMobile ? 100 : 200} />
    </AppShell>
  );
};

export default Layout;
