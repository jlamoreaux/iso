import { Container, Stack, Title } from "@mantine/core";
import React from "react";
import { useLoaderData } from "react-router-dom";
import MessageTile from "../../components/Cards/MessageTile";
import { IncomingMessage } from "../../services/api";

// Message inbox page
const Inbox: React.FC = () => {
  const messages = useLoaderData() as IncomingMessage[];

  return (
    <Container>
      <Title>INBOX</Title>
      <Stack spacing="md">
        {messages.map((message: any, i: number) => (
          <MessageTile message={message} key={i} />
        ))}
      </Stack>
    </Container>
  );
};

export default Inbox;
