import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Container, Loader, Stack, Text } from "@mantine/core";
import { Event, getEventsByPhotographer } from "../../services/api.js";
import EventCard from "../../components/cards/EventCard.jsx";
import usePaginatedData from "../../hooks/usePaginatedData.js";

type EventsTabProps = {
  profileId: string;
};

const CenteredLoader = () => (
  <Container w="100%" pos="relative" display="flex" p="0">
    <Loader m="auto" mt="md" />
  </Container>
);

const EventsTab: React.FC<EventsTabProps> = ({ profileId }) => {
  const { data, hasMore, fetchData, page } = usePaginatedData<Event>(
    // TODO: Add pagination to getEventsByPhotographer
    () => getEventsByPhotographer(profileId)
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

export default EventsTab;
