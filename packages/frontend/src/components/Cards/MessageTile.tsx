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
      <Group bg={isRead ? undefined : theme.colors?.gray?.[2]} noWrap>
        <ProfilePhoto userFullName={`${firstName} ${lastName}`} photoUrl={profilePic} />
        <Stack
          align="stretch"
          style={{
            flexBasis: "100%",
          }}
        >
          <Group position="apart" grow noWrap>
            <Title order={4}>{`${firstName} ${lastName}`}</Title>
            <Title order={5} color={theme!.colors!.seaFoamGreen![4]}>
              {city}, {state}
            </Title>
          </Group>
          <Stack spacing={0}>
            <Text size={"sm"}>{eventDate && new Date(eventDate).toLocaleDateString()}</Text>
            <Text size={"sm"} lineClamp={1}>
              {eventDescription}
            </Text>
            <Text size={"sm"} lineClamp={1}>
              {eventType}
            </Text>
          </Stack>
        </Stack>
      </Group>
    </Link>
  );
};

export default MessageTile;
