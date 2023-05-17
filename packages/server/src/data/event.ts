import { FilterQuery } from "mongoose";
import DALPhotographer from "./photographer";
import Event, { IEvent, EventDocument } from "../models/Event";
import { PhotographerDocument } from "../models/Photographer";
import logger, { LoggerMetadata } from "../utils/logger";
import { Region } from "../utils/regions";
import { getStartOfDay, getEndOfDay } from "../utils/dates";

type EventsFeedParams = {
  userId: string;
  photographerId?: string;
  page?: number;
  limit?: number;
  restrictToUserRegions?: boolean;
};

export type EventsFeedResponse = {
  data: EventDocument[];
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

type EventSearchQuery = {
  keyword?: string;
  city?: string;
  state?: string;
  maxRate?: string;
  minRate?: string;
  date?: string;
};

export type EventSearchResponse = {
  events: EventDocument[];
  totalResults: number;
  totalPages: number;
};

export type EventSearchParams = {
  query: EventSearchQuery;
  page?: number;
  limit?: number;
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
    return { data: eventsToReturn, totalResults, totalPages: Math.ceil(totalResults / limit) };
  },
  search: async ({
    query,
    page = 1,
    limit = 10,
  }: EventSearchParams): Promise<EventSearchResponse> => {
    const loggerMetadata: LoggerMetadata = {
      function: "DALEvent.search",
      page,
      limit,
      totalResults: 0,
    };
    if (page < 1) {
      page = 1;
    }
    if (limit > 50) {
      limit = 50;
      logger.info("Lowering limit of results", loggerMetadata);
    }
    const skip = (page - 1) * limit;
    const dbQuery: FilterQuery<EventDocument> = {
      isDeleted: false,
      isFulfilled: false,
    };
    const minRate = parseInt(query.minRate as string, 10);
    const maxRate = parseInt(query.maxRate as string, 10);

    if (query.keyword) {
      dbQuery.$text = {
        $search: query.keyword,
      };
    }
    // use mongoose $search to look in city and state fields

    if (query.city) {
      dbQuery["location.city"] = {
        $in: [query.city.toLowerCase(), query.city, query.city.toUpperCase()],
      };
    }
    if (query.state) {
      dbQuery["location.state"] = {
        $in: [query.state.toLowerCase(), query.state, query.state.toUpperCase()],
      };
    }
    if (minRate > 0) {
      dbQuery.rate = {
        $gte: query.minRate,
      };
    }
    if (maxRate < 200) {
      dbQuery.rate = {
        ...dbQuery.rate,
        $lte: query.maxRate,
      };
    }
    if (query.date) {
      const date = new Date(query.date);
      if (date.toString() === "Invalid Date") {
        throw new Error("Invalid date");
      }
      const startOfDay = getStartOfDay(date);
      const endOfDay = getEndOfDay(date);
      dbQuery.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else {
      // return dates that are in the future
      dbQuery.date = {
        $gte: new Date(),
      };
    }
    logger.info("Searching events", { ...loggerMetadata, query: dbQuery });
    const events = await Event.find(dbQuery)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
      .catch((err) => {
        logger.error("Error searching events", {
          ...loggerMetadata,
          query: dbQuery,
          error: err,
        });
        throw err;
      });
    const totalResults = await Event.countDocuments(dbQuery);
    loggerMetadata.totalResults = totalResults;
    logger.info("Found events", loggerMetadata);
    return { events, totalResults, totalPages: Math.ceil(totalResults / limit) };
  },
};

export default DALEvent;
