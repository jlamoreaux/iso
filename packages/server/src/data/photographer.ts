// Description: This file contains the data access layer for the photographers
import logger from "../utils/logger";
import Photographer, { IPhotographer, PhotographerDocument } from "../models/Photographer";
import { Region } from "../utils/regions";

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
    } catch (err) {
      logger.error({ function: "DALPhotographer.verify", error: err });
      return callback(err, null);
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
};

export default DALPhotographer;
