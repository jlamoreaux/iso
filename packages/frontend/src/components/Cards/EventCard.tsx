import React from "react";
import { Card, Group, Stack, Title, Text } from "@mantine/core";
import { Event } from "../../services/api";
import theme from "../../styles/theme";
import { ProfileCard } from "./ProfileCards";

type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { id, title, description, location, date, rate, photographer } = event;
  return (
    <Card shadow="md" p="lg" radius="md" withBorder>
      <Stack spacing="xs">
        <Group noWrap align={"start"}>
          <ProfileCard photographer={photographer} style="compact" displayName={false} />
          <Title order={3} size="h4">
            <Text component="a" href={`/event/${id}`}>
              {title}
            </Text>
          </Title>
        </Group>
        {/* <Group position="apart"> */}
        <Text color={theme!.colors!.gold![4]}>{location}</Text>
        <Text color={theme!.colors!.gold![4]}>{new Date(date).toLocaleDateString()}</Text>
        {/* </Group> */}
        <Text lineClamp={2}>{description}</Text>
      </Stack>
    </Card>
  );
};

export default EventCard;
