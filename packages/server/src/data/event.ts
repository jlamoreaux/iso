import logger, { LoggerMetadata } from "../utils/logger";
import Event, { IEvent, EventDocument } from "../models/Event";
import DALPhotographer from "./photographer";

const DALEvent = {
  getEvent: async (id: string): Promise<EventDocument | null> => {
    return await Event.findById(id);
  },
  create: async (event: IEvent): Promise<EventDocument> => {
    return await Event.create(event);
  },
  update: async (id: string, event: IEvent): Promise<EventDocument | null> => {
    return await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
  },
  delete: async (id: string): Promise<EventDocument | null> => {
    return await Event.findByIdAndRemove(id);
  },
  getEventsByPhotographer: async (photographerId: string): Promise<EventDocument[]> => {
    return await Event.find({
      photographer: photographerId,
    });
  },
  getEventsByRegionAndDate: async (region: string, date: Date): Promise<EventDocument[]> => {
    return await Event.find({
      region,
      date,
    });
  },
  getEventsByRegion: async (region: string): Promise<EventDocument[]> => {
    return await Event.find({
      region,
    });
  },
  getEventsForFeed: async ({
    userId,
    page,
    limit = 10,
  }: {
    userId: string;
    page?: string;
    limit?: number;
  }): Promise<{ events: EventDocument[]; totalPages: number; totalResults: number }> => {
    let pageNumber = page ? parseInt(page) : 1;
    if (pageNumber < 1) {
      pageNumber = 1;
    }
    const loggerMetadata: LoggerMetadata = {
      function: "DALEvent.getEventsForFeed",
      userId,
      pageNumber,
      limit,
      totalResults: 0,
    };
    const skip = (pageNumber - 1) * limit;
    const user = await DALPhotographer.findById(userId);
    if (!user) throw new Error("User not found");
    const query = {
      region: {
        $in: user?.regions,
      },
      isDeleted: false,
      isFulfilled: false,
    };

    logger.info("Finding events", loggerMetadata);

    const events = await Event.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalResults = await Event.countDocuments(query);

    loggerMetadata.totalResults = totalResults;
    logger.info("Found events", loggerMetadata);
    // if an event is created by a user's favorite photographer, it should be at the top of the feed

    const favoritePhotographerEvents: EventDocument[] = [];
    const otherEvents: EventDocument[] = [];
    console.log("favorites", user.favorites);
    events.forEach((event) => {
      const photographerId = event.photographer.id;
      console.log("photographerId", photographerId);
      if (photographerId && user.get(`favorites.${photographerId}`)) {
        favoritePhotographerEvents.push(event);
      } else {
        otherEvents.push(event);
      }
    });
    logger.info("Found favorites in events feed", {
      ...loggerMetadata,
      favoritePhotographerEvents: favoritePhotographerEvents.length,
    });
    const eventsToReturn =
      favoritePhotographerEvents?.length > 0
        ? favoritePhotographerEvents.concat(otherEvents)
        : otherEvents;
    return { events: eventsToReturn, totalResults, totalPages: Math.ceil(totalResults / limit) };
  },
};

export default DALEvent;
