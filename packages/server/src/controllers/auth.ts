// Auth controller
import { Response, Request, NextFunction } from "express";
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import { AUTH_TYPE, hashPassword } from "../lib/auth";
import { IPhotographer, PhotographerDocument } from "../models/Photographer";

const registerUser = async (
  photographerData: IPhotographer,
): Promise<PhotographerDocument | null> => {
  const loggerMetadata = {
    function: "registerUser",
  };
  const photographer = await DALPhotographer.register(
    photographerData,
    async (err, photographer) => {
      if (err) {
        logger.warn("Error when registering photographer", {
          ...loggerMetadata,
          photographer,
          error: "Photographer not created",
        });
        throw new Error(err);
      }
      logger.info("Photographer registered", loggerMetadata);
    },
  );
  if (!photographer) {
    logger.warn("Error when looking up the snewly registered photographer", {
      ...loggerMetadata,
      error: "Error when looking up newly registered photographer",
    });
    throw new Error("Error when looking up newly registered photographer");
  }
  return await DALPhotographer.findByEmail(photographerData.email);
};

// login a photographer using passport library
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const loggerMetadata = {
    function: "login",
  };
  if (!req.body.email || !req.body.password) {
    logger.warn("Photographer not found", loggerMetadata);
    return res.status(404).json({ message: "Photographer not found" });
  }
  logger.info("Logging in photographer", loggerMetadata);
  req.login(req.user!, (err: Error) => {
    if (err) {
      logger.error("Error logging in photographer", { ...loggerMetadata, error: err });
      return res.sendStatus(500).json({ message: "Error logging in photographer" });
    }
    // return res.send(req.user);
  });
};

// registers a photographer
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const loggerMetadata = {
    function: "register",
  };
  logger.info("Registering photographer", loggerMetadata);
  const { email } = req.body;
  try {
    const photographer = await DALPhotographer.findByEmail(email);
    if (photographer) {
      logger.info("Photographer already exists", loggerMetadata);
      return res.status(400).json({ message: "Photographer already exists" });
    }
    const newPhotographerData: IPhotographer = req.body;
    newPhotographerData.authType = AUTH_TYPE.LOCAL;
    newPhotographerData.password = await hashPassword(newPhotographerData.password!);
    const newPhotographer = await registerUser(newPhotographerData);
    logger.info("Photographer registered", loggerMetadata);
    req.user = newPhotographer || undefined;
    next();
  } catch (error) {
    logger.error("Error when registering photographer", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error when registering photographer" });
  }
};
