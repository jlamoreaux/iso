import logger, { LoggerMetadata } from "../utils/logger";
import Photographer, { IPhotographer, PhotographerDocument } from "../models/Photographer";
import { findStateNameOrAbbreviation, Region } from "../utils/regions";
import { MongooseError } from "mongoose";

export type PhotographerSearchQuery = {
  name?: string;
  availability?: string;
  state?: string;
  city?: string;
  gear?: string;
  rate?: {
    min: string;
    max: string;
  };
  rating?: string;
};

const DALPhotographer = {
  register: async (
    photographer: IPhotographer,
    callback: (err: any, photographer: IPhotographer) => void,
  ): Promise<PhotographerDocument> => {
    logger.info("Registering photographer", { function: "DALPhotographer.register" });
    const newPhotographer = new Photographer(photographer);
    await Photographer.register(newPhotographer, newPhotographer.password as string, callback);
    return newPhotographer;
  },
  verify: async (
    email: string,
    password: string,
    callback: (err: any, photographer: IPhotographer | null) => void,
  ): Promise<void> => {
    try {
      const photographer = await Photographer.findOne({ email }).exec();
      if (photographer) {
        photographer.verifyPassword(password, (err: any, isMatch: boolean) => {
          if (err) {
            return callback(err, null);
          } else if (isMatch) {
            return callback(null, photographer);
          } else {
            return callback(new Error("Invalid password"), null);
          }
        });
      } else {
        return callback(new Error("User not found"), null);
      }
    } catch (error) {
      logger.error("error when verifying user", {
        function: "DALPhotographer.verify",
        error: error as Error,
      });
      return callback(error, null);
    }
  },
  update: async (id: string, photographer: IPhotographer): Promise<PhotographerDocument | null> => {
    return await Photographer.findByIdAndUpdate(id, photographer, { new: true }).exec();
  },
  findById: async (id: string): Promise<PhotographerDocument | null> => {
    return await Photographer.findById(id).exec();
  },
  findByEmail: async (email: string): Promise<PhotographerDocument | null> => {
    return await Photographer.findOne({ email }).exec();
  },
  findByUsername: async (username: string): Promise<PhotographerDocument | null> => {
    return await Photographer.findOne({ username }).exec();
  },
  findByUsernameOrEmail: async ({
    username,
    email,
  }: {
    username: string;
    email: string;
  }): Promise<PhotographerDocument | null> => {
    return await Photographer.findOne({ $or: [{ username }, { email }] }).exec();
  },
  findByUsernameForAuthenticating: async (
    username: string,
  ): Promise<PhotographerDocument | null> => {
    return await Photographer.findOne({ username }).select("password").exec();
  },
  findByRegion: async (region: Region): Promise<PhotographerDocument[] | null> => {
    return await Photographer.find({ regions: { $elemMatch: region } }).exec();
  },
  findByRegionAndAvailability: async (
    region: Region,
    date: Date,
  ): Promise<PhotographerDocument[] | null> => {
    return await Photographer.find({
      regions: { $elemMatch: region },
      availability: { $ne: date },
    }).exec();
  },
  deletePhotographer: async (id: string): Promise<PhotographerDocument | null> => {
    return await Photographer.findByIdAndDelete(id).exec();
  },
  getFavorites: async (id: string): Promise<PhotographerDocument[] | null> => {
    const photographer = await Photographer.findById(id).populate("favorites").exec();
    if (photographer) {
      return photographer.getFavorites();
    }
    return null;
  },
  addFavorite: async (id: string, favoriteId: string): Promise<PhotographerDocument | null> => {
    const setKey = `favorites.${favoriteId}`;
    return await Photographer.findByIdAndUpdate(id, {
      $set: { [setKey]: true },
    }).exec();
  },
  removeFavorite: async (id: string, favoriteId: string): Promise<PhotographerDocument | null> => {
    const unsetKey = `favorites.${favoriteId}`;
    return await Photographer.findByIdAndUpdate(id, {
      $unset: { [unsetKey]: true },
    }).exec();
  },
  search: async ({
    query,
    page,
    limit,
  }: {
    query: PhotographerSearchQuery;
    page: number;
    limit: number;
  }): Promise<{
    photographers: PhotographerDocument[];
    totalPages: number;
    totalResults: number;
  }> => {
    const metadata: LoggerMetadata = {
      function: "DALPhotographer.search",
      totalResults: undefined,
      pageNumber: page,
      results: [],
    };

    const isEmptyQuery = Object.values(query).every((value) => {
      // check if value is string or has min and max properties
      if (typeof value === "string") {
        return !value;
      }
      return !value.min && !value.max;
    });

    if (isEmptyQuery) {
      logger.info("No query provided", metadata);
      return {
        photographers: [],
        totalPages: 0,
        totalResults: 0,
      };
    }

    let findQuery = Photographer.find();

    if (query.name) {
      findQuery = findQuery.or([
        { firstName: { $regex: query.name, $options: "i" } },
        { lastName: { $regex: query.name, $options: "i" } },
      ]);
    }
    if (query.state) {
      const { state } = query;
      const [abbr, stateName] = findStateNameOrAbbreviation(state);
      findQuery = findQuery.where("regions").elemMatch({
        $or: [
          { state: { $regex: abbr, $options: "i" } },
          { state: { $regex: stateName, $options: "i" } },
        ],
      });
    }
    if (query.city) {
      findQuery = findQuery.where("regions").elemMatch({
        city: { $regex: query.city, $options: "i" },
      });
    }
    if (query.availability) {
      findQuery = findQuery.where("availability").ne(query.availability);
    }
    if (query.gear) {
      findQuery = findQuery.where("gear").equals(query.gear);
    }
    if (query.rate) {
      // convert min and max to numbers
      const min = Number(query.rate.min),
        max = Number(query.rate.max);
      if (min && min > 0) {
        findQuery = findQuery.where("hourlyRate").gte(min);
      } else if (max && max < 200) {
        findQuery = findQuery.where("hourlyRate").lte(max);
      }
    }
    if (query.rating) {
      // convert rating to number
      const rating = Number(query.rating);

      findQuery = findQuery.where("rating").gte(rating);
    }

    // Add pagination to the query
    findQuery = findQuery.skip((page - 1) * limit).limit(limit);

    logger.info("searching for photographers", metadata);
    const photographers = await findQuery.exec().catch((err: MongooseError) => {
      throw new Error(err.message);
    });
    const totalResults = await Photographer.countDocuments(findQuery.getFilter());
    const totalPages = Math.ceil(totalResults / limit);

    metadata.totalResults = totalResults;
    metadata.results = photographers.map((photographer) => photographer._id);
    logger.info("search complete", metadata);

    return { photographers, totalPages, totalResults };
  },
};

export default DALPhotographer;
