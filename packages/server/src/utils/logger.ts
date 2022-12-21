// Logger utility
import { Request } from "express";
import { createLogger, format, transports } from "winston";

export type LoggerMetadata = {
  [key: string]: any;
  timestamp: never;
  level: never;
  message: never;
  label: never;
  metadata: never;
};

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.metadata({
      fillExcept: ["timestamp", "level", "message", "label", "metadata"],
    }),

    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: (req: Request) => ({ requestId: req.headers["x-request-id"] }),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
