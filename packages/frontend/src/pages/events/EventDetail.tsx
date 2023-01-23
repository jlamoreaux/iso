// Event Detail View

import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Card,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Space,
  Container,
  Textarea,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createEventComment, Event, EventComment } from "../../services/api";
import theme from "../../styles/theme";
import { ProfileCard } from "../../components/cards/ProfileCards";
import { AuthWrapper, useAuth } from "../../context/AuthProvider";
import Timestamp from "../../components/Timestamp";
import { IconDots } from "@tabler/icons";

const EventDetail: React.FC = () => {
  const { user } = useAuth();
  const event = useLoaderData() as Event;
  const {
    id,
    title,
    description,
    location,
    date,
    rate,
    photographer,
    comments: initialComments,
  } = event;
  const isAuthor = user?.id === photographer.id;
  const [comments, setComments] = useState<EventComment[]>([]);

  const form = useForm({
    initialValues: {
      text: "",
    },
  });

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
  }, [initialComments, setComments]);

  const handleSubmitComment = async (values: any) => {
    const data = await createEventComment(id, values);
    if (!data || !data.photographer || !data.text) return;
    form.reset();
    setComments([...comments, data]);
  };

  return (
    <AuthWrapper>
      <Card shadow="md" p="lg" radius="md" withBorder sx={{ width: "100%" }}>
        <Stack spacing="xs">
          <Group noWrap align={"start"}>
            <ProfileCard photographer={photographer} style="compact" displayName={false} />
            <Title order={2} sx={{ flex: 1 }}>
              <Text>{title}</Text>
            </Title>
            {isAuthor && (
              <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon color={theme!.colors!.gold![4]} size="sm">
                    <IconDots />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => {}}>Edit</Menu.Item>
                  <Menu.Item onClick={() => {}}>Delete</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
          <Group noWrap align={"start"}>
            <Text color={theme!.colors!.gold![4]} weight="bold">
              {location}
            </Text>
            <Text color={theme!.colors!.gold![4]} fs="italic">
              {new Date(date).toLocaleDateString()}
            </Text>
          </Group>
          {rate && <Text color={theme!.colors!.gold![4]}>${rate}/hour</Text>}
          <Text>{description}</Text>
        </Stack>
        <Container size="sm" m={16}>
          <form onSubmit={form.onSubmit(handleSubmitComment)}>
            <Textarea
              name="text"
              aria-label="comment"
              required
              placeholder="Enter your comment"
              style={{ maxWidth: 400 }}
              {...form.getInputProps("text")}
            />
            <Space h="xs" />
            <Button type="submit">Submit</Button>
          </form>
        </Container>
        <Stack spacing="lg">
          {comments &&
            comments.map((comment) => (
              <Group w="100%">
                <ProfileCard
                  photographer={comment.photographer}
                  style="compact"
                  displayName={false}
                />
                <Stack sx={{ flex: 1 }} spacing={0}>
                  <Group position="apart" noWrap>
                    <Title order={6} size="h6">
                      {comment.photographer.firstName} {comment.photographer.lastName}
                    </Title>
                    <Timestamp dateTime={new Date(comment.createdAt)} />
                  </Group>
                  <Text>{comment.text}</Text>
                </Stack>
              </Group>
            ))}
        </Stack>
      </Card>
    </AuthWrapper>
  );
};

export default EventDetail;