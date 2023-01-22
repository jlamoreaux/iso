import { Router } from "express";
import {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsForFeed,
} from "../controllers/events";
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
  getFavoritePhotographers,
  addFavoritePhotographer,
  removeFavoritePhotographer,
  searchPhotographers,
} from "../controllers/photographers";
import { catchErrors } from "../utils/errors";

const apiRouter = Router();

// Photographer routes
apiRouter.get("/photographer", catchErrors(getCurrentPhotographer));
apiRouter.get("/photographer/:id", catchErrors(getPhotographerById));
apiRouter.put("/photographer/:id", catchErrors(updatePhotographerById));
apiRouter.get("/photographers/:region", catchErrors(getPhotographersByRegion));
apiRouter.get("/photographers/:region/:date", catchErrors(getPhotographersByRegionAndAvailability));
apiRouter.post("/photographers/search", catchErrors(searchPhotographers));

apiRouter.get("/favorites", catchErrors(getFavoritePhotographers));
apiRouter.post("/favorites", catchErrors(addFavoritePhotographer));
apiRouter.delete("/favorites", catchErrors(removeFavoritePhotographer));

// Message routes
apiRouter.get("/messages", catchErrors(getMessages));
apiRouter.get("/messages/:id", catchErrors(getMessage));
apiRouter.post("/messages", catchErrors(createMessage));
apiRouter.patch("/messages/:id", catchErrors(updateMessage));
apiRouter.delete("/messages/:id", catchErrors(deleteMessage));

// Event routes
apiRouter.get("/events", catchErrors(getEventsForFeed));
apiRouter.get("/events/:id", catchErrors(getEvent));
apiRouter.post("/events", catchErrors(createEvent));
apiRouter.put("/events/:id", catchErrors(updateEvent));
apiRouter.delete("/events/:id", catchErrors(deleteEvent));

export default apiRouter;
