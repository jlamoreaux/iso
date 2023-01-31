import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getEvents } from "../../services/api";
import CreateEventButton from "../../components/buttons/CreateEventButton";
import EventsList from "./EventsList";

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
