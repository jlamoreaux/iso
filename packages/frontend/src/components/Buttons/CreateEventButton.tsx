import React, { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons";
import GeoAutocomplete from "../input/GeoAutocomplete";
import { createEvent } from "../../services/api";

type CreateEventButtonProps = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ top, right, bottom, left }) => {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const tooltipLabel = <Text size="xs">Create Event</Text>;

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      location: "",
      date: "",
      rate: "",
    },

    validate: {
      title: (value) => {
        if (!value) return "Don't forget a title";
        if (value.length < 5) return "Let's try something a little more descriptive";
      },
      description: (value) => {
        if (!value) return "Add a description so photographers know what you're looking for";
        if (value.length < 10) return "That looks a little short";
      },
      location: (value) => {
        if (!value)
          return "Location is required. This will allow photographers to find your event.";
        if (value.length < 4) return "Please enter a valid location";
      },
      date: (value) => {
        if (!value) return "Please enter a date for your event";
        // Value should be a valid mm/dd/yyyy date
        const [month, day, year] = value.split("/");
        if (month.length !== 2 || day.length !== 2 || year.length !== 4)
          return "Please enter a valid date in the format MM/DD/YYYY";
      },
      rate: (value) => {
        // Value should only be a number
        if (isNaN(Number(value))) return "Please enter a valid number";
      },
    },
  });

  const handleCancel = () => {
    form.reset();
    setError(false);
    setSuccess(false);
    setOpened(false);
  };

  const handleSubmit = async (values: any) => {
    const data = await createEvent(values);
    if (!data || !data.id) {
      setError(true);
      return;
    }
    setSuccess(true);
  };

  return (
    <>
      <Modal opened={opened} onClose={handleCancel} title="New event">
        {loading && <Loader />}
        {success && (
          <Text size="xl" align="center">
            Event created successfully!
          </Text>
        )}
        {error && (
          <Text size="xl" align="center">
            Oh shoot! Something went wrong...
            <br />
            Please try again later.
          </Text>
        )}
        {!loading && !success && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <TextInput
                label="Title"
                placeholder="A brief summary (e.g. 'Second Shooter for 8 hours')"
                {...form.getInputProps("title")}
              />
              <Textarea
                label="Description"
                placeholder="Describe the event and what you're looking for in detail."
                {...form.getInputProps("description")}
              />
              <GeoAutocomplete
                label="Location"
                placeholder="Location of the event"
                {...form.getInputProps("location")}
              />
              <TextInput label="Date" placeholder="MM/DD/YYYY" {...form.getInputProps("date")} />
              <TextInput
                label="Rate"
                placeholder='Hourly rate in dollars, e.g. "80"'
                {...form.getInputProps("rate")}
              />
            </Stack>
            <Group m="lg">
              <Button type="submit" variant="filled">
                Create
              </Button>
              <Button onClick={handleCancel} variant="subtle">
                Cancel
              </Button>
            </Group>
          </form>
        )}
      </Modal>

      <Group
        position="center"
        pos="fixed"
        top={top}
        right={right}
        bottom={bottom}
        left={left}
        sx={{ zIndex: 10 }}
      >
        <Tooltip label={tooltipLabel} withArrow>
          <ActionIcon
            onClick={() => setOpened(true)}
            size="lg"
            radius="xl"
            variant="filled"
            color="theme.colors.primary"
            sx={{ boxShadow: "3px 3px 6px 1px rgba(0, 0, 0, 0.3)" }}
          >
            <IconPlus size="16px" />
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  );
};

export default CreateEventButton;
