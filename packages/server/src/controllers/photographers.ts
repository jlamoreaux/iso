// Photograhers Controller
import { Request, Response } from "express";
import { IPhotographer, PhotographerDocument } from "../models/Photographer";
import DALPhotographer, { PhotographerSearchQuery } from "../data/photographer";
import logger from "../utils/logger";
/**
 * @description - gets a photographer with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}RE
 */
export const getPhotographerById = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const loggerMetadata = {
    function: "getPhotographerById",
    photographerId: id,
    userId: "",
  };
  logger.info("Getting photographer by id", loggerMetadata);

  let photographer: PhotographerDocument | null;
  try {
    photographer = await DALPhotographer.findById(id);
    if (!photographer) {
      logger.info("Photographer not found", loggerMetadata);
      return res.status(404).json({ message: "Photographer not found" });
    }
    let isFavorite = false;
    if (req.user) {
      loggerMetadata.userId = (req.user as IPhotographer).id || "";
      logger.info("Checking if photographer is favorite", loggerMetadata);
      const user = await DALPhotographer.findById((req.user as IPhotographer).id || "");
      if (user && (await user.checkIfIsFavorite(photographer.id))) {
        logger.info("Photographer is favorite", loggerMetadata);
        isFavorite = true;
      }
    }
    const result = {
      firstName: photographer.firstName,
      lastName: photographer.lastName,
      gear: photographer.gear,
      regions: photographer.regions,
      profilePic: photographer.profilePic,
      isFavorite,
      bio: photographer.bio,
      id: photographer.id,
      city: photographer.city,
      state: photographer.state,
    };
    return res.status(200).json(result);
  } catch (error) {
    logger.warn("An error occurred while getting photographer", loggerMetadata);
    return res.status(500).json({ error: "An error occurred while getting photographer" });
  }
};

/**
 * @description - gets the current photographer
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getCurrentPhotographer = async (req: Request, res: Response): Promise<Response> => {
  const loggerMetadata = {
    function: "getCurrentPhotographer",
  };
  logger.info("Getting current photographer", loggerMetadata);
  const user = req.user as IPhotographer;
  if (!user) {
    logger.info("User not logged in", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  const photographer = await DALPhotographer.findById(user.id || "");
  if (!photographer) {
    logger.info("Photographer not found", loggerMetadata);
    return res.status(404).json({ message: "Photographer not found" });
  }
  return res.status(200).json(photographer);
};

export const getPhotographersByRegion = async (req: Request, res: Response): Promise<Response> => {
  const region = req.params.region;
  const [city, state] = region.split("-"); // city-state
  const loggerMetadata = {
    function: "getPhotographersByRegion",
    region,
  };
  logger.info("Getting photographers by region", loggerMetadata);
  let photographers: PhotographerDocument[] | null;
  try {
    photographers = await DALPhotographer.findByRegion({ city, state });
    return res.status(200).json(photographers);
  } catch (error) {
    logger.warn("An error occurred while getting photographers", loggerMetadata);
    return res.status(500).json({ error: "An error occurred while getting photographers" });
  }
};

export const getPhotographersByRegionAndAvailability = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const region = req.params.region;
  const date = new Date(req.params.date);
  const [city, state] = region.split("-"); // city-state
  const loggerMetatada = {
    function: "getPhotographersByRegionAndAvailability",
    region,
    date,
  };
  logger.info("Getting photographers by region and availability", loggerMetatada);
  let photographers: PhotographerDocument[] | null;
  try {
    photographers = await DALPhotographer.findByRegionAndAvailability({ city, state }, date);
    return res.status(200).json(photographers);
  } catch (error) {
    logger.warn("An error occurred while getting photographers", loggerMetatada);
    return res.status(500).json({ error: "An error occurred while getting photographers" });
  }
};

/**
 * @description - updates a photographer with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updatePhotographerById = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const photographer: IPhotographer = req.body;
  const loggerMetadata = {
    function: "updatePhotographerById",
    photographerId: id,
  };
  logger.info("Updating photographer by id", loggerMetadata);
  let updatedPhotographer: PhotographerDocument | null;
  try {
    updatedPhotographer = await DALPhotographer.update(id, photographer);
    if (!updatedPhotographer) {
      logger.info("Photographer not found", loggerMetadata);
      return res.status(404).json({ message: "Photographer not found" });
    }
    return res.status(200).json(updatedPhotographer);
  } catch (error) {
    logger.warn("An error occurred while updating photographer", loggerMetadata);
    return res.status(500).json({ error: "An error occurred while updating photographer" });
  }
};

/**
 * @description - gets favorite photographers for the current photographer
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getFavoritePhotographers = async (req: Request, res: Response): Promise<Response> => {
  const loggerMetadata = {
    function: "getFavoritePhotographers",
  };
  logger.info("Getting favorite photographers", loggerMetadata);
  const user = req.user as IPhotographer;
  if (!user) {
    logger.info("Photographer not found", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  let favorites: PhotographerDocument[] | null = [];
  try {
    favorites = await DALPhotographer.getFavorites(user.id || "");
  } catch (error) {
    logger.warn("An error occurred while getting favorite photographers", loggerMetadata);
  }
  return res.status(200).json(favorites);
};

/**
 * @description - adds a photographer to the current photographer's favorites
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const addFavoritePhotographer = async (req: Request, res: Response): Promise<Response> => {
  const photographerId = req.body.id as string;
  const loggerMetadata = {
    function: "addFavoritePhotographer",
    photographerId,
  };
  logger.info("Adding favorite photographer", loggerMetadata);
  const user = req.user as IPhotographer;
  if (!user) {
    logger.info("Photographer not found", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  let photographer: PhotographerDocument | null;
  try {
    photographer = await DALPhotographer.findById(photographerId);
    if (!photographer) {
      logger.info("Photographer not found", loggerMetadata);
      return res.status(404).json({ message: "Photographer not found" });
    }
    await DALPhotographer.addFavorite(user.id || "", photographerId);
    return res.status(200).json(photographer);
  } catch (error: any) {
    logger.warn("An error occurred while adding favorite photographer", {
      ...loggerMetadata,
      error: error.message,
    });
    return res.status(500).json({ error: "An error occurred while adding favorite photographer" });
  }
};

/**
 * @description - removes a photographer from the current photographer's favorites
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const removeFavoritePhotographer = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const photographerId = req.body.id as string;
  const loggerMetadata = {
    function: "removeFavoritePhotographer",
    photographerId,
  };
  logger.info("Removing favorite photographer", loggerMetadata);
  const user = req.user as IPhotographer;
  if (!user) {
    logger.info("Photographer not found", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  let photographer: PhotographerDocument | null;
  try {
    photographer = await DALPhotographer.findById(photographerId);
    if (!photographer) {
      logger.info("Photographer not found", loggerMetadata);
      return res.status(404).json({ message: "Photographer not found" });
    }
    await DALPhotographer.removeFavorite(user.id || "", photographerId);
    return res.status(200).json(photographer);
  } catch (error: any) {
    logger.warn("An error occurred while removing favorite photographer", {
      ...loggerMetadata,
      error: error.message,
    });
    return res
      .status(500)
      .json({ error: "An error occurred while removing favorite photographer" });
  }
};

/**
 * @description - search for photographers by name, city, state, rate, rating, gear and/or availability
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 * @todo - add pagination
 */
export const searchPhotographers = async (req: Request, res: Response): Promise<Response> => {
  const query = req.body as PhotographerSearchQuery;
  const page = (req.body.page as number) || 1;
  const loggerMetadata = {
    function: "searchPhotographers",
    query,
  };
  logger.info("Received search photographers request", loggerMetadata);
  try {
    const { photographers, totalPages, totalResults } = await DALPhotographer.search({
      query,
      page,
      limit: 10,
    });
    return res.status(200).json({ photographers, totalPages, totalResults });
  } catch (error) {
    logger.warn("An error occurred while searching photographers", {
      ...loggerMetadata,
      error,
    });
    return res.status(500).json({ error: "An error occurred while searching photographers" });
  }
};
