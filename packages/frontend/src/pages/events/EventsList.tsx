import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getEvents, Event } from "../../services/api";
import { Container, Loader, Stack } from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import EventCard from "../../components/cards/EventCard";
import CreateEventButton from "../../components/buttons/CreateEventButton";

type EventsListProps = {
  fetchEvents: (page: number) => Promise<{ events: Event[]; totalPages: number }>;
};

const CenteredLoader = () => (
  <Container w="100%" pos="relative" display="flex" p="0">
    <Loader m="auto" mt="md" />
  </Container>
);

const EventsList: React.FC<EventsListProps> = ({ fetchEvents }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchData = useCallback(async () => {
    // fetch data
    const data = await fetchEvents(page);
    // set events
    if (!data) return setHasMore(false);
    setPage(page + 1);
    setHasMore(data.totalPages > page);
    setEvents([...events, ...data.events]);
  }, [events, page]);

  useEffect(() => {
    fetchData();
  }, []);

  const content = useMemo(() => {
    if (!events || events.length === 0) {
      return <div>No events found</div>;
    }

    return events.map((event, i) => <EventCard key={i} event={event} />);
  }, [events]);

  return (
    <InfiniteScroll
      dataLength={events.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<CenteredLoader />}
    >
      <Stack spacing="xl">{content}</Stack>
    </InfiniteScroll>
  );
};

export default EventsList;
