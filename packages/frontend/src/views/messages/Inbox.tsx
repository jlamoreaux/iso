import React from "react";
import { useLoaderData } from "react-router-dom";
import { Container, Stack, Title } from "@mantine/core";
import { AuthWrapper } from "../../context/AuthProvider.js";
import MessageTile from "../../components/cards/MessageTile.js";
import { IncomingMessage } from "../../services/api.js";

const sortMessages = (messages: IncomingMessage[]) => {
  if (messages.length > 0) {
    return messages.sort((a: any, b: any) => {
      return new Date(b.lastReply).valueOf() - new Date(a.lastReply).valueOf();
    });
  }
};

// Message inbox page
const Inbox: React.FC = () => {
  const unsortedMessages = useLoaderData() as IncomingMessage[];
  let sortedMessages: IncomingMessage[] | undefined;
  if (unsortedMessages) {
    sortedMessages = sortMessages(unsortedMessages);
  }

  return (
    <AuthWrapper>
      <Container>
        <Title>INBOX</Title>
        <Stack spacing="md">
          {sortedMessages &&
            sortedMessages.length > 0 &&
            sortedMessages.map((message: any, i: number) => (
              <MessageTile message={message} key={i} />
            ))}
        </Stack>
      </Container>
    </AuthWrapper>
  );
};

export default Inbox;
