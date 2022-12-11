// Description: This file contains the data access layer for the photographers
import logger from "../utils/logger";
import Photographer, { IPhotographer, IPhotographerDocument } from "../model/Photographer";

const DALPhotographer = {
  register: async (
    photographer: IPhotographer,
    callback: (err: any, photographer: IPhotographer) => void,
  ): Promise<void> => {
    await Photographer.register(photographer, photographer.password!, callback);
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
  update: async (
    id: string,
    photographer: IPhotographer,
  ): Promise<IPhotographerDocument | null> => {
    return await Photographer.findByIdAndUpdate(id, photographer, { new: true }).exec();
  },
  findById: async (id: string): Promise<IPhotographerDocument | null> => {
    return await Photographer.findById(id).exec();
  },
  findByEmail: async (email: string): Promise<IPhotographerDocument | null> => {
    return await Photographer.findOne({ email }).exec();
  },
  findByRegion: async (region: string): Promise<IPhotographerDocument[] | null> => {
    return await Photographer.find({ regions: region }).exec();
  },
  findByRegionAndAvailability: async (
    region: string,
    date: Date,
  ): Promise<IPhotographerDocument[] | null> => {
    return await Photographer.find({ regions: region, availability: { $ne: date } }).exec();
  },
  deletePhotographer: async (id: string): Promise<IPhotographerDocument | null> => {
    return await Photographer.findByIdAndDelete(id).exec();
  },
};

export default DALPhotographer;
