import React from "react";
import { getEvents } from "../../services/api.ts";
import CreateEventButton from "../../components/buttons/CreateEventButton.ts";
import EventsList from "./EventsList.ts";

const EventsFeed = () => {
  const fetchData = async (page: number) => {
    return await getEvents(page);
  };

  return (
    <>
      <CreateEventButton bottom={48} right={24} />
      <EventsList fetchEvents={fetchData} />
    </>
  );
};

export default EventsFeed;
