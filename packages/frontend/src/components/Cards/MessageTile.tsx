import React from "react";
import { Group, Title, Text, Badge, Stack, List, HoverCard } from "@mantine/core";
import { IncomingMessage, Message } from "../../services/api";
import { ProfilePhoto } from "../images/ProfilePhoto";
import theme from "../../styles/theme";
import { Link } from "react-router-dom";

type MessageTileProps = {
  message: IncomingMessage;
};

export const MessageTile: React.FC<MessageTileProps> = ({ message }) => {
  const { firstName, lastName, city, state, profilePic } = message.sender;
  const { lastReply, eventTitle, isRead, message: body } = message;
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
          p={4}
        >
          <Group position="apart">
            <Stack spacing={0}>
              <Title order={4}>{`${firstName} ${lastName}`}</Title>
              <Title order={5} color={theme!.colors!.seaFoamGreen![4]}>
                {city}, {state}
              </Title>
            </Stack>
            <Stack spacing={0} align="end">
              <Text size={"sm"}>{lastReply && new Date(lastReply).toLocaleTimeString()}</Text>
              <Text size={"sm"}>{lastReply && new Date(lastReply).toLocaleDateString()}</Text>
            </Stack>
          </Group>
          <Stack spacing={0}>
            <Title order={6} lineClamp={2}>
              {eventTitle}
            </Title>
            <Text size={"sm"} color={theme.colors?.gray?.[9]} lineClamp={1}>
              {body}
            </Text>
          </Stack>
        </Stack>
      </Group>
    </Link>
  );
};

export default MessageTile;
