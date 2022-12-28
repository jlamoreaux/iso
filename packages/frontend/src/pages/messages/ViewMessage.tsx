// Page to view recieved message

import { Container, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { PrimaryLink } from "../../components/buttons";
import { ProfileCard } from "../../components/cards/ProfileCards";
import { IncomingMessage, updateMessage } from "../../services/api";

const ViewMessage = () => {
  const { id } = useParams() as { id: string };
  const {
    sender,
    message,
    eventDate,
    eventDescription,
    eventLocation,
    eventTitle,
    eventType,
    createdAd,
    isRead,
  } = useLoaderData() as IncomingMessage;
  const [isDeleted, setIsDeleted] = useState(false);

  const markAsRead = async () => {
    updateMessage(id, { isRead: true });
  };

  useEffect(() => {
    if (!isRead) {
      markAsRead();
    }
  }, []);

  return (
    <Stack>
      <Title>Message</Title>
      <ProfileCard photographer={sender} />
      <Container size="sm">
        <Title order={3}>{eventTitle}</Title>
        <Text>{message}</Text>
      </Container>
      <PrimaryLink href={`/messages/${id}/reply`}>Reply</PrimaryLink>
    </Stack>
  );
};

export default ViewMessage;
