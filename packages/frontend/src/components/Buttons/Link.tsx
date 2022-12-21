import React from "react";
import { Anchor, AnchorProps } from "@mantine/core";
import theme from "../../styles/theme";

type LinkProps = AnchorProps & {
  children: React.ReactNode;
  href: string;
};

export const PrimaryLink: React.FC<LinkProps> = ({ href, children, ...props }: LinkProps) => {
  return (
    <Anchor
      href={href}
      bg="salmon"
      color="white"
      size={"lg"}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "2rem",
        display: "flex",
        width: "100%",
        maxWidth: "340px",
        justifyContent: "center",
      }}
      {...props}
    >
      {" "}
      {children}{" "}
    </Anchor>
  );
};

export const SecondaryLink: React.FC<LinkProps> = ({ children, href, ...props }: LinkProps) => {
  return (
    <Anchor href={href} {...props}>
      Link
    </Anchor>
  );
};
