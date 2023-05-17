import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getEvents } from "../../services/api.js";
import CreateEventButton from "../../components/buttons/CreateEventButton.jsx";
import EventsList from "./EventsList.jsx";

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
