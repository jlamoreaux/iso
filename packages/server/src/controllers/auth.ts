// Auth controller
import { Response, Request, NextFunction } from "express";
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import { AUTH_TYPE, hashPassword } from "../lib/auth";
import { IPhotographer, PhotographerDocument } from "../models/Photographer";
import passport from "passport";
import { findNearestRegion } from "../utils/regions";

const registerUser = async (
  photographerData: IPhotographer,
): Promise<PhotographerDocument | null> => {
  const loggerMetadata = {
    function: "registerUser",
  };
  logger.info("Registering photographer", loggerMetadata);
  const currentPhotographer = await DALPhotographer.register(
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
      return await DALPhotographer.findByUsername(photographer.username);
    },
  );
  if (!currentPhotographer) {
    logger.warn("Error when looking up the snewly registered photographer", {
      ...loggerMetadata,
      error: "Error when looking up newly registered photographer",
    });
    throw new Error("Error when looking up newly registered photographer");
  }
  return currentPhotographer;
};

// login a photographer using passport library
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const loggerMetadata = {
    function: "login",
  };
  logger.info("Logging in photographer", loggerMetadata);
  const user = req.user as PhotographerDocument;
  return res.status(200).json({ id: user?.id });
};

// logout a photographer
export const logout = async (req: Request, res: Response): Promise<Response | void> => {
  const loggerMetadata = { function: "logout", user: req.user };
  logger.info("Logging out user", loggerMetadata);
  req.logout((error) => {
    if (error) {
      logger.error("Error during logout", { ...loggerMetadata, error });
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
};

// registers a photographer
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  if (!req.body) return res.status(400).json({ message: "No body" });
  if (!req.body.username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const loggerMetadata = {
    function: "register",
  };
  const { username, email } = req.body;
  try {
    const photographer = await DALPhotographer.findByUsernameOrEmail({ username, email });
    if (photographer) {
      logger.info("Photographer already exists", loggerMetadata);
      return res.status(400).json({ message: "Photographer already exists" });
    }
    const newPhotographerData: IPhotographer = req.body;
    newPhotographerData.authType = AUTH_TYPE.LOCAL;
    newPhotographerData.password = await hashPassword(newPhotographerData.password!);
    const region = findNearestRegion({
      city: newPhotographerData.city,
      state: newPhotographerData.state,
    });
    if (region) {
      newPhotographerData.regions = [region];
    }
    const newPhotographer = await registerUser(newPhotographerData);
    logger.info("Photographer registered", {
      ...loggerMetadata,
      photographerId: newPhotographer?.id,
    });
    req.user = { ...newPhotographer };
    req.body.id = newPhotographer?.id;
  } catch (error) {
    logger.error("Error when registering photographer", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error when registering photographer" });
  }
  next();
};

export const authTest = async (req: Request, res: Response) => {
  logger.info("Auth test", { user: req.user });
  await passport.authenticate("local", {
    failureMessage: "Unauthorized",
    successMessage: "Authorized",
  });
};
