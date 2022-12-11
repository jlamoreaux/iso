import { createLogger, format, transports } from "winston";
const logger = createLogger({
    format: format.combine(format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), format.metadata({
        fillExcept: ["timestamp", "level", "message", "label", "metadata"],
    }), format.errors({ stack: true }), format.splat(), format.json()),
    defaultMeta: (req) => ({ requestId: req.headers["x-request-id"] }),
    transports: [
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
    }));
}
export default logger;
