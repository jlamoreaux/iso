import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getEvents, Event, EventFeedResponse } from "../../services/api";
import { Loader, Stack } from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import EventCard from "../../components/cards/EventCard";

const EventsFeed = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchData = useCallback(async () => {
    // fetch data
    const data = await getEvents(page);
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
      loader={<Loader />}
    >
      <Stack spacing="xl">{content}</Stack>
    </InfiniteScroll>
  );
};

export default EventsFeed;
