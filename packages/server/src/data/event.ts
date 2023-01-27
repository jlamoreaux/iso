import logger, { LoggerMetadata } from "../utils/logger";
import Event, { IEvent, EventDocument } from "../models/Event";
import DALPhotographer from "./photographer";
import { PhotographerDocument } from "../models/Photographer";
import { Region } from "../utils/regions";

type EventsFeedParams = {
  userId: string;
  photographerId?: string;
  page?: number;
  limit?: number;
  restrictToUserRegions?: boolean;
};

export type EventsFeedResponse = {
  events: EventDocument[];
  totalPages: number;
  totalResults: number;
};

type DBFeedQuery = {
  photographer?: string;
  region?: {
    $in: Region[];
  };
  date?: Date;
  isDeleted?: boolean;
  isFulfilled?: boolean;
};

const DALEvent = {
  getEvent: async (id: string): Promise<IEvent | null> => {
    return await Event.findById(id);
  },
  create: async (event: IEvent): Promise<IEvent> => {
    return await Event.create(event);
  },
  update: async (id: string, event: Partial<IEvent>): Promise<EventDocument | null> => {
    return await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
  },
  softDelete: async (id: string, authorId: string): Promise<IEvent | null> => {
    return await Event.findOneAndUpdate(
      { id, photographer: authorId },
      { isDeleted: true },
      { new: true },
    );
  },
  getEventsByPhotographer: async (photographer: string): Promise<EventDocument[]> => {
    return await Event.find({
      photographer,
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
    photographerId,
    restrictToUserRegions = true,
  }: EventsFeedParams): Promise<EventsFeedResponse> => {
    let pageNumber = page || 1;
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
    let user: PhotographerDocument | null = null;
    let userRegions: Region[] = [];
    if (restrictToUserRegions) {
      user = await DALPhotographer.findById(userId);
      if (user?.regions && user.regions.length > 0) {
        userRegions = user.regions;
      }
    }
    const query: DBFeedQuery = {
      region: {
        $in: userRegions,
      },
      isDeleted: false,
      isFulfilled: false,
    };

    if (photographerId) {
      query.photographer = photographerId;
    }

    logger.info("Finding events", loggerMetadata);

    const events = await Event.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalResults = await Event.countDocuments(query);

    loggerMetadata.totalResults = totalResults;
    logger.info("Found events", loggerMetadata);
    // if an event is created by a user's favorite photographer, it should be at the top of the feed

    const favoritePhotographerEvents: EventDocument[] = [];
    const otherEvents: EventDocument[] = [];
    events.forEach((event) => {
      const photographerId = event.photographer.id;
      if (photographerId && user?.get(`favorites.${photographerId}`)) {
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
