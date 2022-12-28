import { Group, GroupProps, Navbar, NavbarProps, NavLink } from "@mantine/core";
import React from "react";
import { useLocation } from "react-router-dom";
import navItems from "./navigationItems";

type ActiveNav = typeof navItems[number]["name"];
type MobileNavProps = Omit<GroupProps, "children">;

const MobileNavBar: React.FC<MobileNavProps> = ({ hidden }) => {
  const location = useLocation().pathname;
  const active = navItems.find((item) => item.path === location)?.name;

  return (
    <Group
      style={{
        display: hidden ? "none" : "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
      position="apart"
      p="0"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          component="a"
          href={item.path}
          // icon={item.icon}
          label={item.name}
          active={active === item.name}
          style={{
            padding: ".5em",
            textAlign: "center",
          }}
        />
      ))}
    </Group>
  );
};

export default MobileNavBar;
