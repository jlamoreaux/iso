import React from "react";
import CreateEventButton from "../../components/buttons/CreateEventButton.jsx";
import EventsList from "./EventsList.jsx";

const EventsFeed = () => {
  return (
    <>
      <CreateEventButton bottom={48} right={24} />
      <EventsList />
    </>
  );
};

export default EventsFeed;
