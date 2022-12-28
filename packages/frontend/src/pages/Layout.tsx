import { AppShell, Burger, Footer, Header, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { Outlet } from "react-router-dom";
import MobileNavBar from "../components/nav/MobileNav";
import NavBar from "../components/nav/NavBar";

const Layout: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 400px)");

  return (
    <AppShell
      fixed
      navbar={
        <NavBar p="md" hiddenBreakpoint="md" width={{ sm: 200, lg: 300 }} hidden={isMobile} />
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Title>ISO</Title>
          </div>
        </Header>
      }
      footer={
        <Footer height="60" position={{ bottom: 0 }}>
          <MobileNavBar hidden={!isMobile} />
        </Footer>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default Layout;
