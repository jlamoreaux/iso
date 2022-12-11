// Auth controller
import { Response, Request, NextFunction } from "express";
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import passport, { AUTH_TYPE, hashPassword } from "../lib/auth";
import { IPhotographer } from "../model/Photographer";

// login a photographer using passport library
export const login = async (req: Request, res: Response): Promise<Response> => {
  const loggerMetadata = {
    function: "login",
  };
  logger.info("Logging in photographer", loggerMetadata);
  return passport.authenticate("local", (err, user) => {
    if (err) {
      logger.warn("Error when logging in", loggerMetadata);
      return res.status(500).json({ message: "Error when logging in" });
    }
    if (!user) {
      logger.info("Photographer not found", loggerMetadata);
      return res.status(404).json({ message: "Photographer not found" });
    }
    req.logIn(user, (err) => {
      if (err) {
        logger.warn("Error when logging in", loggerMetadata);
        return res.status(500).json({ message: "Error when logging in" });
      }
      logger.info("Photographer logged in", loggerMetadata);
      return res.status(200).json({ message: "Photographer successfully logged in" });
    });
    return res.status(200).json({ message: "Photographer logged in" });
  })(req, res);
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
    await DALPhotographer.register(newPhotographerData, async (err, photographer) => {
      if (err) {
        logger.warn("Error when registering photographer", {
          ...loggerMetadata,
          error: "Photographer not created",
        });
        return res.status(500).json({ message: "Error when registering photographer" });
      }
      logger.info("Photographer registered", loggerMetadata);
      const newPhotographer = await DALPhotographer.findByEmail(email);
      passport.authenticate("local")(req, res, () => {
        res.redirect(`/photographer/${newPhotographer?.id}`);
      });
    });
  } catch (error) {
    logger.warn("Error when registering photographer", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error when registering photographer" });
  }
};
