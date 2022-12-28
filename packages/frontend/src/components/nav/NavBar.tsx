import { Navbar, NavbarProps, NavLink } from "@mantine/core";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import navItems from "./navigationItems";

type ActiveNav = typeof navItems[number]["name"];
type NavBarProps = Omit<NavbarProps, "children">;

const NavBar: React.FC<NavBarProps> = (navbarProps) => {
  const location = window.location.pathname;
  const active = navItems.find((item) => item.path === location)?.name;
  // const [active, setActive] = useState<ActiveNav>("Home");
  return (
    <Navbar {...navbarProps}>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          component="a"
          href={item.path}
          // icon={item.icon}
          label={item.name}
          active={active === item.name}
          // onClick={() => setActive(item.name)}
        />
      ))}
    </Navbar>
  );
};

export default NavBar;