// Page to view recieved message

import { Button, Collapse, Container, Group, Space, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import MessageTile from "../../components/cards/MessageTile";
import { PrimaryLink } from "../../components/buttons";
import { ProfileCard } from "../../components/cards/ProfileCards";
import { MessageResponse, updateMessage } from "../../services/api";
import { AuthWrapper } from "../../context/AuthProvider";

const ViewMessage = () => {
  const [repliesOpen, setRepliesOpen] = useState(true);
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(undefined);
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
    isRootMessage,
    isRead,
    replies,
  } = message;

  const threadMessages = replies && replies.length > 0 ? [message, ...replies] : thread;

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

  const location = useLocation();

  useEffect(() => {
    if (!isRead) {
      markAsRead();
    }
    // get location and set the currentMessage to the id of the message being viewed based on the url location
    const currentMessageId = location.pathname.split("/").pop();
    if (currentMessageId !== currentMessage) {
      setCurrentMessage(currentMessageId);
    }
  }, [location]);

  return (
    <AuthWrapper>
      <Container>
        <Stack align="center">
          <Title>Message</Title>
          <ProfileCard photographer={sender} />
          <Group style={{ width: "100%" }} position="center">
            <Stack spacing={"md"} align="center" style={{ width: "100%" }}>
              <Title order={3} style={{ width: "100%" }}>
                {eventTitle}
              </Title>
              <Text style={{ width: "100%", textAlign: "left" }}>{body}</Text>
              <Space p={24} />
              <PrimaryLink href={`/messages/${id}/reply`}>Reply</PrimaryLink>
            </Stack>
            {threadMessages && threadMessages.length > 0 && (
              <Stack style={{ width: "100%" }}>
                <CollapseButton open={repliesOpen} setOpen={setRepliesOpen}>
                  {repliesOpen ? "Hide" : "Show"} {threadMessages.length} repl
                  {threadMessages.length > 1 ? "ies" : "y"}
                </CollapseButton>
                <Collapse in={repliesOpen}>
                  {/* {isRootMessage && (
                    <MessageTile
                      message={message}
                      key={message.id}
                      currentMessage={currentMessage}
                      isMessageView
                    />
                  )} */}
                  {threadMessages.map((msg) => (
                    <MessageTile
                      message={msg}
                      key={msg.id}
                      currentMessage={currentMessage}
                      isMessageView
                    />
                  ))}
                </Collapse>
              </Stack>
            )}
          </Group>
        </Stack>
      </Container>
    </AuthWrapper>
  );
};

export default ViewMessage;
