import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  Overlay,
  Space,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { IconAlertTriangle } from "@tabler/icons-react";
import { createMessage, MessageResponse } from "../../services/api.js";
import { ReactComponent as Calendar } from "../../assets/svg/calendar.svg";
import { AuthWrapper } from "../../context/AuthProvider.js";
import theme from "../../styles/theme.js";

type FormValues = {
  message: string;
  eventTitle: string;
  eventDate: Date;
  eventType: string;
  eventLocation: string;
  eventDescription: string;
};

const Compose: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const recipient = new URLSearchParams(useLocation().search).get("p");
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    initialValues: {
      message: "",
      eventTitle: "",
      eventDate: new Date(),
      eventType: "",
      eventLocation: "",
      eventDescription: "",
    },
    validate: {
      eventTitle: (value) => !value && "Event title is required",
      message: (value) => !value && "Message is required",
    },
  });

  const { message: replyMessage } = (useLoaderData() as MessageResponse) || {};

  useEffect(() => {
    if (replyMessage) {
      form.setValues({
        eventTitle: replyMessage.eventTitle,
        eventDate: replyMessage.eventDate,
        eventType: replyMessage.eventType,
        eventLocation: replyMessage.eventLocation,
        eventDescription: replyMessage.eventDescription,
      });
      setIsReply(true);
    }
  }, []);

  const handleSubmit = async (values: any) => {
    // TODO: remove static recipient id
    values.recipient = recipient;
    if (replyMessage) {
      values.replyTo = replyMessage.replyTo || replyMessage.id;
    }
    const data = await createMessage(values);
    if (data) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    // TODO: add camera graphic
    return (
      <Container>
        <Title>Your message has been sent!</Title>
      </Container>
    );
  }

  return (
    <AuthWrapper>
      <Container>
        <Title>Compose{isReply && " Reply"}</Title>
        {!recipient && (
          <>
            <Overlay opacity={0.8} color={theme.colors?.gray?.[9]} zIndex={1} />
            <Alert
              icon={<IconAlertTriangle size={64} />}
              title="Oops!"
              style={{ zIndex: 9 }}
              variant="filled"
            >
              <Text>
                Looks like you're trying to send a message to no one. recipient: {recipient}
                <br />
                You can send a message by going to the photgrapher's profile and clicking the
                contact button.
                <Space p={8} />
                <Button color={"white"} variant="outline" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              </Text>
            </Alert>
          </>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            aria-label="Event Title"
            name="eventTitle"
            placeholder="Event Title"
            disabled={isReply}
            {...form.getInputProps("eventTitle")}
          />
          <DatePicker
            aria-label="Event Date"
            label="Event Date"
            name="eventDate"
            placeholder="mm/dd/yyyy"
            firstDayOfWeek="sunday"
            minDate={new Date()}
            rightSection={<Calendar />}
            disabled={isReply}
            {...form.getInputProps("eventDate")}
          />
          <TextInput
            aria-label="Event Type"
            name="eventType"
            placeholder="Event Type"
            disabled={isReply}
            {...form.getInputProps("eventType")}
          />
          <TextInput
            aria-label="Event Location"
            name="eventLocation"
            placeholder="Event Location"
            disabled={isReply}
            {...form.getInputProps("eventLocation")}
          />
          <TextInput
            aria-label="Event Description"
            name="eventDescription"
            placeholder="Event Description"
            disabled={isReply}
            {...form.getInputProps("eventDescription")}
          />
          <Textarea
            aria-label="Message"
            name="message"
            placeholder="Message"
            multiline
            {...form.getInputProps("message")}
          />
          <button type="submit">Send</button>
        </form>
      </Container>
    </AuthWrapper>
  );
};

export default Compose;
