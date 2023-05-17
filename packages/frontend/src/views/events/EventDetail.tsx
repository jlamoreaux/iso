import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
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
  TextInput,
  LoadingOverlay,
  Alert,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDots } from "@tabler/icons-react";
import { DatePicker } from "@mantine/dates";
import {
  createEventComment,
  deleteEvent,
  Event,
  EventComment,
  updateEvent,
} from "../../services/api.js";
import theme from "../../styles/theme.js";
import ProfileCard from "../../components/cards/ProfileCards.js";
import { AuthWrapper, useAuth } from "../../context/AuthProvider.js";
import Timestamp from "../../components/Timestamp.js";
import GeoAutocomplete from "../../components/input/GeoAutocomplete.js";

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
  const { city, state } = location || { undefined };
  const isAuthor = user?.id === photographer.id;
  const [comments, setComments] = useState<EventComment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingError, setEditingError] = useState<string | null>(null);
  const [deletingError, setDeletingError] = useState<string | null>(null);
  const [deletingSuccess, setDeletingSuccess] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const navigate = useNavigate();

  const commentForm = useForm({
    initialValues: {
      text: "",
    },
  });

  const editEventForm = useForm({
    initialValues: {
      title,
      description,
      location,
      date: new Date(date),
      rate,
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
    commentForm.reset();
    setComments([...comments, data]);
  };

  const handleEdit = () => {
    if (isAuthor) {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    editEventForm.reset();
    setIsEditing(false);
  };

  const handleSaveEdit = async (values: any) => {
    const data = await updateEvent(id, values);
    if (!data) {
      setEditingError("Error updating event");
      return;
    }
    window.location.reload();
  };

  const handleDelete = () => {
    if (deletingError) setDeletingError(null);
    if (deletingSuccess) setDeletingSuccess(null);
    setIsDeleting(true);
    const data = deleteEvent(id);
    setIsDeleting(false);
    if (!data) {
      setDeletingError("Error deleting event");
      return;
    }
    setDeletingSuccess("Event deleted");
  };

  const closeModal = () => {
    if (deletingSuccess) navigate("/");
    setModalOpened(false);
  };

  return (
    <AuthWrapper>
      <Card shadow="md" p="lg" radius="md" withBorder sx={{ width: "100%" }}>
        <LoadingOverlay visible={isDeleting} overlayBlur={2} />
        <Group align="start" grow>
          <Container size="sm" m={4} sx={{ flex: 0 }}>
            <ProfileCard photographer={photographer} style="compact" displayName={false} />
          </Container>
          <Container sx={{ flex: 1 }}>
            <Stack sx={{ flex: 1 }} spacing={"sm"}>
              {isEditing ? (
                <form onSubmit={editEventForm.onSubmit(handleSaveEdit)}>
                  {editingError && <Alert color="red">{editingError}</Alert>}
                  <Stack spacing="xs">
                    <TextInput
                      name="title"
                      aria-label="title"
                      placeholder="Title"
                      {...editEventForm.getInputProps("title")}
                    />
                    <GeoAutocomplete
                      name="location"
                      aria-label="location"
                      placeholder="Location"
                      {...editEventForm.getInputProps("location")}
                    />
                    <DatePicker
                      name="date"
                      aria-label="date"
                      placeholder="Date"
                      {...editEventForm.getInputProps("date")}
                    />
                    <TextInput
                      name="rate"
                      aria-label="rate"
                      placeholder="Rate"
                      {...editEventForm.getInputProps("rate")}
                    />
                    <Textarea
                      name="description"
                      aria-label="description"
                      placeholder="Description"
                      {...editEventForm.getInputProps("description")}
                    />
                    <Group>
                      <Button type="submit">Save Changes</Button>
                      <Button onClick={handleCancelEdit} variant="subtle">
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                </form>
              ) : (
                <>
                  <Group position="apart">
                    <Title order={2}>
                      <Text>{title}</Text>
                    </Title>
                    {isAuthor && (
                      <>
                        <Modal
                          title="Delete Event"
                          opened={modalOpened}
                          onClose={closeModal}
                          transition="slide-down"
                          size="sm"
                        >
                          {deletingError && (
                            <>
                              <Alert color="red">{deletingError}</Alert>
                              <Space h="md" />
                            </>
                          )}
                          {deletingSuccess ? (
                            <>
                              <Alert color="green">{deletingSuccess}</Alert>
                              <Space h="md" />
                              <Button onClick={closeModal}>Return to Home</Button>
                            </>
                          ) : (
                            <>
                              <Text>Are you sure you want to delete this event?</Text>
                              <Space h="md" />
                              <Group position="center">
                                <Button onClick={handleDelete}>Delete</Button>
                                <Button variant="subtle" onClick={() => setModalOpened(false)}>
                                  Cancel
                                </Button>
                              </Group>
                            </>
                          )}
                        </Modal>
                        <Menu withinPortal position="bottom-end" shadow="sm">
                          <Menu.Target>
                            <ActionIcon color={theme!.colors!.gold![4]} size="sm" sx={{ flex: 0 }}>
                              <IconDots />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item onClick={handleEdit}>Edit</Menu.Item>
                            <Menu.Item onClick={() => setModalOpened(true)}>Delete</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </>
                    )}
                  </Group>
                  <Group noWrap align={"start"}>
                    {city && state && (
                      <Text color={theme!.colors!.gold![4]} weight="bold">
                        {city}, {state}
                      </Text>
                    )}
                    <Text color={theme!.colors!.gold![4]} fs="italic">
                      {new Date(date).toLocaleDateString()}
                    </Text>
                  </Group>
                  {rate && <Text color={theme!.colors!.gold![4]}>${rate}/hour</Text>}
                  <Text>{description}</Text>
                </>
              )}
              <form onSubmit={commentForm.onSubmit(handleSubmitComment)}>
                <Textarea
                  name="text"
                  aria-label="comment"
                  required
                  placeholder="Enter your comment"
                  style={{ maxWidth: 400 }}
                  {...commentForm.getInputProps("text")}
                />
                <Space h="xs" />
                <Button type="submit">Submit</Button>
              </form>
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
            </Stack>
          </Container>
        </Group>
      </Card>
    </AuthWrapper>
  );
};

export default EventDetail;
