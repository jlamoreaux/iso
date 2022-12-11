import logger from "./logger";
// wrapper function to catch errors
export const catchErrors = (fn) => {
    return function (req, res, next) {
        return fn(req, res, next).catch((err) => {
            logger.error(err.message);
            next(err);
        });
    };
};
