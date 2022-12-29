import { Response, Request, NextFunction } from "express";
import logger from "./logger";

// wrapper function to catch errors
export const catchErrors = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((err: Error) => {
      logger.error(err.message);
      next(err);
    });
  };
};

// parse error and return error message
export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};
