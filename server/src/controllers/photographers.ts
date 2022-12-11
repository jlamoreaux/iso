// Photograhers Controller
import { Request, Response } from "express";
import { IPhotographer, IPhotographerDocument } from "../model/Photographer";
import DALPhotographer from "../data/photographer";
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
  };
  logger.info("Getting photographer by id", loggerMetadata);

  let photographer: IPhotographerDocument | null;
  try {
    photographer = await DALPhotographer.findById(id);
  } catch (error) {
    logger.info("Photographer not found", loggerMetadata);
    return res.status(404).json({ message: "Photographer not found" });
  }
  return res.status(200).json(photographer);
};

export const getPhotographersByRegion = async (req: Request, res: Response): Promise<Response> => {
  const region = req.params.region;
  const loggerMetadata = {
    function: "getPhotographersByRegion",
    region,
  };
  logger.info("Getting photographers by region", loggerMetadata);
  let photographers: IPhotographerDocument[] | null;
  try {
    photographers = await DALPhotographer.findByRegion(region);
  } catch (error) {
    logger.info("Photographers not found", loggerMetadata);
    return res.status(404).json({ message: "Photographers not found" });
  }
  return res.status(200).json(photographers);
};

export const getPhotographersByRegionAndAvailability = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const region = req.params.region;
  const date = new Date(req.params.date);
  const loggerMetatada = {
    function: "getPhotographersByRegionAndAvailability",
    region,
    date,
  };
  logger.info("Getting photographers by region and availability", loggerMetatada);
  let photographers: IPhotographerDocument[] | null;
  try {
    photographers = await DALPhotographer.findByRegionAndAvailability(region, date);
  } catch (error) {
    logger.info("Photographers not found", loggerMetatada);
    return res.status(404).json({ message: "Photographers not found" });
  }
  return res.status(200).json(photographers);
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
  let updatedPhotographer: IPhotographerDocument | null;
  try {
    updatedPhotographer = await DALPhotographer.update(id, photographer);
  } catch (error) {
    logger.info("Photographer not found", loggerMetadata);
    return res.status(404).json({ message: "Photographer not found" });
  }
  return res.status(200).json(updatedPhotographer);
};
