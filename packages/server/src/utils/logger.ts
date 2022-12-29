// Logger utility
import { Request } from "express";
import { createLogger, format, transports } from "winston";

export type LoggerMetadata = Omit<
  LoggerFieldsToOmit,
  "timestamp" | "level" | "message" | "label" | "metadata"
> & {
  [key: string]: string | number | boolean | object | undefined | Error;
};

type LoggerFieldsToOmit = {
  timestamp?: never;
  level?: never;
  message?: never;
  label?: never;
  metadata?: never;
};

const winstonLogger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.metadata({
      fillExcept: ["timestamp", "level", "message", "label", "metadata"],
    }),

    format.errors({ stack: true }),
    format.printf((info) => {
      const { timestamp, level, message, ...metadata } = info;
      const metadataString = Object.keys(metadata)
        .map((key) => {
          if (typeof metadata[key] === "object") {
            return `${key}: ${JSON.stringify(metadata[key])}`;
          }
          return `${key}: ${metadata[key]}`;
        })
        .join(", ");
      return `${timestamp} ${level}: ${message} ${metadataString}`;
    }),
  ),
  defaultMeta: (req: Request) => ({ requestId: req.headers["x-request-id"] }),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  winstonLogger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

const logger = {
  info: (message: string, metadata?: LoggerMetadata) => {
    winstonLogger.info(message, metadata);
  },
  error: (message: string, metadata?: LoggerMetadata) => {
    winstonLogger.error(message, metadata);
  },
  warn: (message: string, metadata?: LoggerMetadata) => {
    winstonLogger.warn(message, metadata);
  },
  debug: (message: string, metadata?: LoggerMetadata) => {
    winstonLogger.debug(message, metadata);
  },
};

export default logger;
