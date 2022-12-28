import React from "react";
import { Anchor, Container, Space, Stack } from "@mantine/core";
import { PrimaryLink } from "../../components/buttons";

const Home: React.FC = () => {
  return (
    <Container>
      <Stack spacing="md" align="center">
        <p>The best platform for photographers to find and hire other photographers.</p>
        <Space h="xl" />
        <Space h="xl" />
        <PrimaryLink href="/login">Login</PrimaryLink>
        <Anchor href="/register" className="register-button">
          Register
        </Anchor>
      </Stack>
    </Container>
  );
};

export default Home;
