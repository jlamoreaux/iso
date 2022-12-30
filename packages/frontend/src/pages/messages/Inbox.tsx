import { Container, Loader, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { AuthWrapper } from "../../context/AuthProvider";
import MessageTile from "../../components/cards/MessageTile";
import { IncomingMessage } from "../../services/api";

// Message inbox page
const Inbox: React.FC = () => {
  const unsortedMessages = useLoaderData() as IncomingMessage[];

  const messages = unsortedMessages.sort((a: any, b: any) => {
    return new Date(b.lastReply).valueOf() - new Date(a.lastReply).valueOf();
  });

  return (
    <AuthWrapper>
      <Container>
        <Title>INBOX</Title>
        <Stack spacing="md">
          {messages &&
            messages.length > 0 &&
            messages.map((message: any, i: number) => <MessageTile message={message} key={i} />)}
        </Stack>
      </Container>
    </AuthWrapper>
  );
};

export default Inbox;
