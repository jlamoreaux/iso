import { Response, Request, NextFunction } from "express";
import logger from "./logger";

// wrapper function to catch errors
export const catchErrors = (fn: Function) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((err: Error) => {
      logger.error(err.message);
      next(err);
    });
  };
};
