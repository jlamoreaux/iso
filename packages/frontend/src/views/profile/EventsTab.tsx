import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Stack, Text } from "@mantine/core";
import { Event, getEventsByPhotographer } from "../../services/api.js";
import EventCard from "../../components/cards/EventCard.jsx";

type EventsTabProps = {
  profileId: string;
};

const EventsTab: React.FC<EventsTabProps> = ({ profileId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = async () => {
    const data = await getEventsByPhotographer(profileId);
    if (!data || !data.events) return setHasMore(false);
    setPage(page + 1);
    setHasMore(data.totalPages > page);
    setEvents(data.events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const content = useMemo(() => {
    if (!events || events.length === 0) {
      return <div>No events found</div>;
    }

    return events.map((event, i) => <EventCard key={i} event={event} />);
  }, [events]);

  return (
    <InfiniteScroll
      dataLength={events?.length}
      next={fetchEvents}
      hasMore={hasMore}
      loader={<Text>Loading...</Text>}
    >
      <Stack spacing="xl" p="md">
        {content}
      </Stack>
    </InfiniteScroll>
  );
};

export default EventsTab;
