// Auth controller
import { Response, Request, NextFunction } from "express";
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import { AUTH_TYPE, hashPassword } from "../lib/auth";
import { IPhotographer } from "../models/Photographer";
import { findNearestRegion } from "../utils/regions";
import { registerUser } from "../lib/auth";

// login a photographer using passport library
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const loggerMetadata = {
    function: "login",
  };
  logger.info("Logging in photographer", loggerMetadata);
  if (!req.user) {
    logger.warn("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = req.user as IPhotographer;
  const photographer = await DALPhotographer.findById(user.id || "");
  if (!photographer) {
    logger.warn("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id, firstName, lastName, profilePic } = photographer;
  return res.status(200).json({
    id,
    firstName,
    lastName,
    profilePic,
  });
};

// logout a photographer
export const logout = async (req: Request, res: Response): Promise<Response | void> => {
  const loggerMetadata = { function: "logout", user: req.user };
  logger.info("Logging out user", loggerMetadata);
  req.logout((error) => {
    if (error) {
      logger.error("Error during logout", { ...loggerMetadata, error: error as Error });
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
  if (!req.body.username.trim() || !req.body.email.trim()) {
    return res.status(400).json({ message: "Username and email addressare required" });
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

    if (!newPhotographerData.password) {
      return res.status(400).json({ message: "Password is required" });
    }
    newPhotographerData.authType = AUTH_TYPE.LOCAL;
    newPhotographerData.password = await hashPassword(newPhotographerData.password);
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
    logger.error("Error when registering photographer", {
      ...loggerMetadata,
      error: error as Error,
    });
    return res.status(500).json({ message: "Error when registering photographer" });
  }
  next();
};

// gets the current user
export const checkAuth = async (req: Request, res: Response): Promise<Response | void> => {
  const user = req.user as IPhotographer;
  const loggerMetadata = {
    function: "getCurrentUser",
    userId: user?.id || "unknown",
  };
  logger.info("Getting current user", loggerMetadata);
  if (!user) {
    logger.warn("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePic: user.profilePic,
  });
};
