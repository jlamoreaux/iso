import React from "react";
import { Card, Group, Stack, Title, Text } from "@mantine/core";
import { Event } from "../../services/api";
import theme from "../../styles/theme";
import { ProfileCard } from "./ProfileCards";

type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // TODO: Add report button
  const { id, title, description, location, date, rate, photographer, commentsCount } = event;
  return (
    <Card shadow="md" p="xl" radius="md" withBorder>
      <Card.Section withBorder>
        <Group noWrap align={"start"} p={8} position="apart">
          <ProfileCard photographer={photographer} style="compact" displayName={false} />
          <Stack>
            <Title order={3} size="h4">
              <Text component="a" href={`/event/${id}`}>
                {title}
              </Text>
            </Title>
            <Group spacing="xs" mt={-12}>
              <Text color={theme!.colors!.gold![4]} size="xs" weight="bold">
                {location}
              </Text>
              <Text color={theme!.colors!.gold![4]} size="xs">
                {new Date(date).toLocaleDateString()}
              </Text>
              {rate && (
                <Text color={theme!.colors!.gold![4]} size="xs">
                  {rate} per hour
                </Text>
              )}
            </Group>
            <Text lineClamp={2}>{description}</Text>
            <Text color={theme!.colors!.gold![4]} size="xs" component="a" href={`/event/${id}`}>
              {commentsCount} comments
            </Text>
          </Stack>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default EventCard;
