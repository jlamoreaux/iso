import { Router } from "express";
import {
  getPhotographerById,
  getPhotographersByRegion,
  getPhotographersByRegionAndAvailability,
  updatePhotographerById,
} from "../controllers/photographers";
import {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messages";
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/events";
import { register, login } from "../controllers/auth";
import { catchErrors } from "../utils/catchErrors";
import passport from "../lib/auth";
import { AUTH_TYPE } from "../lib/auth";

const router = Router();

// Photographer routes
router.get("/photographer/:id", catchErrors(getPhotographerById));
router.put("/photographer/:id", catchErrors(updatePhotographerById));
router.get("/photographers/:region", catchErrors(getPhotographersByRegion));
router.get("/photographers/:region/:date", catchErrors(getPhotographersByRegionAndAvailability));

// Message routes
router.get("/messages", catchErrors(getMessages));
router.get("/messages/:id", catchErrors(getMessage));
router.post("/messages", catchErrors(createMessage));
router.put("/messages/:id", catchErrors(updateMessage));
router.delete("/messages/:id", catchErrors(deleteMessage));

// Event routes
router.get("/events", catchErrors(getEvents));
router.get("/events/:id", catchErrors(getEvent));
router.post("/events", catchErrors(createEvent));
router.put("/events/:id", catchErrors(updateEvent));
router.delete("/events/:id", catchErrors(deleteEvent));

// Auth routes
router.post("/register", catchErrors(register), catchErrors(login));
router.post("/login", catchErrors(login));

export default router;
