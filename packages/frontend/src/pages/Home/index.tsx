import React from "react";
import { Anchor, Container, Loader, Space, Stack, Text } from "@mantine/core";
import { PrimaryLink } from "../../components/buttons";
import { AuthWrapper, useAuth } from "../../context/AuthProvider";
import EventsFeed from "../events/EventsFeed";

const Home: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  return (
    <Container>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <Text>Hello{user?.firstName && `, ${user.firstName}`}!</Text>
          <EventsFeed />
        </>
      ) : (
        <Stack spacing="md" align="center">
          <p>The best platform for photographers to find and hire other photographers.</p>
          <Space h="xl" />
          <Space h="xl" />
          <PrimaryLink href="/login">Login</PrimaryLink>
          <Anchor href="/register" className="register-button">
            Register
          </Anchor>
        </Stack>
      )}
    </Container>
  );
};

export default Home;
