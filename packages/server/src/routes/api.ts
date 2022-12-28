import { NextFunction, Request, Response, Router } from "express";
import logger from "../utils/logger";
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/events";
import {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messages";
import {
  getCurrentPhotographer,
  getPhotographerById,
  updatePhotographerById,
  getPhotographersByRegion,
  getPhotographersByRegionAndAvailability,
} from "../controllers/photographers";
import { catchErrors } from "../utils/catchErrors";

const apiRouter = Router();

// Photographer routes
apiRouter.get(
  "/photographer",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info({ user: req.user });
    next();
  },
  catchErrors(getCurrentPhotographer),
);
apiRouter.get("/photographer/:id", catchErrors(getPhotographerById));
apiRouter.put("/photographer/:id", catchErrors(updatePhotographerById));
apiRouter.get("/photographers/:region", catchErrors(getPhotographersByRegion));
apiRouter.get("/photographers/:region/:date", catchErrors(getPhotographersByRegionAndAvailability));

// Message routes
apiRouter.get("/messages", catchErrors(getMessages));
apiRouter.get("/messages/:id", catchErrors(getMessage));
apiRouter.post("/messages", catchErrors(createMessage));
apiRouter.patch("/messages/:id", catchErrors(updateMessage));
apiRouter.delete("/messages/:id", catchErrors(deleteMessage));

// Event routes
apiRouter.get("/events", catchErrors(getEvents));
apiRouter.get("/events/:id", catchErrors(getEvent));
apiRouter.post("/events", catchErrors(createEvent));
apiRouter.put("/events/:id", catchErrors(updateEvent));
apiRouter.delete("/events/:id", catchErrors(deleteEvent));

export default apiRouter;
