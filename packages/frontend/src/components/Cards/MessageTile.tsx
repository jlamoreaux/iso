import React from "react";
import { Group, Title, Text, Badge, Stack, List, HoverCard, Indicator } from "@mantine/core";
import { IncomingMessage, Message } from "../../services/api";
import { ProfilePhoto } from "../images/ProfilePhoto";
import theme from "../../styles/theme";
import { Link } from "react-router-dom";

type MessageTileProps = {
  message: IncomingMessage;
  currentMessage?: string;
  isMessageView?: boolean;
};

export const MessageTile: React.FC<MessageTileProps> = ({
  message,
  currentMessage,
  isMessageView,
}) => {
  const { firstName, lastName, city, state, profilePic } = message.sender;
  const {
    lastReply,
    eventTitle,
    isRead,
    hasUnreadReplies,
    lastReadReplyId,
    message: body,
    replies,
  } = message;
  const markUnread = hasUnreadReplies || !isRead;
  let url = `/messages/${message.id}`;
  if (!isMessageView && replies && replies.length > 0) {
    url = `/messages/${lastReadReplyId || replies[replies.length - 1]}`;
  }

  return (
    <Link
      to={url}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Group bg={currentMessage === message.id ? theme.colors?.gray?.[2] : undefined} noWrap>
        <ProfilePhoto userFullName={`${firstName} ${lastName}`} photoUrl={profilePic} />
        <Stack
          align="stretch"
          style={{
            flexBasis: "100%",
          }}
          p={4}
        >
          <Indicator disabled={!markUnread} position="top-end" size={14} offset={-8}>
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
          </Indicator>
        </Stack>
      </Group>
    </Link>
  );
};

export default MessageTile;
