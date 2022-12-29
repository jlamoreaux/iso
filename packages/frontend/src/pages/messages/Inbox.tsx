import { Container, Loader, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import MessageTile from "../../components/cards/MessageTile";
import { IncomingMessage, MessageResponse } from "../../services/api";
import Login from "../auth/Login";

// Message inbox page
const Inbox: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();
  const unsortedMessages = useLoaderData() as IncomingMessage[];
  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const messages = unsortedMessages.sort((a: any, b: any) => {
    return new Date(b.lastReply).valueOf() - new Date(a.lastReply).valueOf();
  });

  return (
    <Container>
      <Title>INBOX</Title>
      <Stack spacing="md">
        {messages &&
          messages.length > 0 &&
          messages.map((message: any, i: number) => <MessageTile message={message} key={i} />)}
      </Stack>
    </Container>
  );
};

export default Inbox;
