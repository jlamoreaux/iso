import React, { useMemo, useState } from "react"; // Import useState
import { Container, Loader, Stack } from "@mantine/core";
import InfiniteScroll from "react-infinite-scroller";
import { Event, EventFeedResponse, getEvents } from "../../services/api.js";
import EventCard from "../../components/cards/EventCard";
import usePaginatedData from "../../hooks/usePaginatedData";

const CenteredLoader = () => (
  <Container w="100%" pos="relative" display="flex" p="0">
    <Loader m="auto" mt="md" />
  </Container>
);

const EventsList: React.FC = () => {
  const { data, hasMore, fetchData, page } = usePaginatedData<Event>(
    (page) => getEvents(page) // Pass the page argument to getEvents
  );

  const events = useMemo(() => data, [data]);

  if (!events || !events.length) {
    return <div>No events to display</div>;
  }

  return (
    <div>
      <InfiniteScroll
        loadMore={() => {
          fetchData(page + 1); // Pass the updated page
        }}
        hasMore={hasMore}
        loader={<CenteredLoader />}
      >
        <Stack spacing="xl">
          {events.map((event, i) => (
            <EventCard event={event} key={i} />
          ))}
        </Stack>
      </InfiniteScroll>
    </div>
  );
};

export default EventsList;
