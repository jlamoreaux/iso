// Page to view recieved message

import { Button, Collapse, Container, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import MessageTile from "../../components/cards/MessageTile";
import { PrimaryLink } from "../../components/buttons";
import { ProfileCard } from "../../components/cards/ProfileCards";
import { MessageResponse, updateMessage, IncomingMessage } from "../../services/api";

const ViewMessage = () => {
  const { id } = useParams() as { id: string };
  const { message, thread } = useLoaderData() as MessageResponse;
  const {
    sender,
    message: body,
    eventDate,
    eventDescription,
    eventLocation,
    eventTitle,
    eventType,
    createdAt,
    isRead,
    replies,
  } = message;
  const [isDeleted, setIsDeleted] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);

  const threadMessages = replies && replies.length > 0 ? replies : thread;

  const CollapseButton = ({
    open,
    setOpen,
    children,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
  }) => (
    <Button onClick={() => setOpen(!open)} variant="subtle">
      {children}
    </Button>
  );

  const markAsRead = async () => {
    updateMessage(id, { isRead: true });
  };

  useEffect(() => {
    if (!isRead) {
      markAsRead();
    }
  }, []);

  return (
    <Container>
      <Stack>
        <Title>Message</Title>
        <ProfileCard photographer={sender} />
        <Container size="md" style={{ width: "100%" }}>
          <Title order={3}>{eventTitle}</Title>
          <Text style={{ width: "100%", textAlign: "left" }}>{body}</Text>
          {threadMessages && threadMessages.length > 0 && (
            <>
              <CollapseButton open={repliesOpen} setOpen={setRepliesOpen}>
                {repliesOpen ? "Hide" : "Show"} {threadMessages.length} repl
                {threadMessages.length > 1 ? "ies" : "y"}
              </CollapseButton>
              <Collapse in={repliesOpen}>
                {threadMessages.map((msg) => (
                  <MessageTile message={msg} key={msg.id} />
                ))}
              </Collapse>
            </>
          )}
        </Container>
        <PrimaryLink href={`/messages/${id}/reply`}>Reply</PrimaryLink>
      </Stack>
    </Container>
  );
};

export default ViewMessage;
