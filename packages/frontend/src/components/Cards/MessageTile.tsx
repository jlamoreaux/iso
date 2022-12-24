import React from "react";
import { Group, Title, Text, Badge, Stack, List, HoverCard } from "@mantine/core";
import { IncomingMessage, Message } from "../../services/api";
import { ProfilePhoto } from "../ProfilePhoto";
import theme from "../../styles/theme";
import { Link } from "react-router-dom";

type MessageTileProps = {
  message: IncomingMessage;
};

export const MessageTile: React.FC<MessageTileProps> = ({ message }) => {
  const { firstName, lastName, city, state, profilePic } = message.sender;
  const { eventType, eventDate, eventLocation, eventDescription, isRead } = message;
  return (
    <Link
      to={`/messages/${message.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Group>
        <ProfilePhoto userFullName={`${firstName} ${lastName}`} photoUrl={profilePic} />
        <Stack>
          <Group position="apart">
            <Title order={3}>{`${firstName} ${lastName}`}</Title>
            <Title order={5} color={theme!.colors!.seaFoamGreen![4]}>
              {city}, {state}
            </Title>
          </Group>
          <Text>{eventDate && new Date(eventDate).toLocaleDateString()}</Text>
          <Text lineClamp={1}>{eventDescription}</Text>
          <Text lineClamp={1}>{eventType}</Text>
        </Stack>
      </Group>
    </Link>
  );
};

export default MessageTile;
