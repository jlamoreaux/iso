// Events controller
import { Request, Response } from "express";
import { IEvent, EventDocument } from "../models/Event";
import DALEvent from "../data/event";
import logger from "../utils/logger";
import { IPhotographer } from "../models/Photographer";
import { DALEventComment } from "../data/eventComment";

/**
 * @description - gets a event with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getEvent = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const loggerMetadata = {
    function: "getEvent",
    eventId: id,
  };
  logger.info("Getting event by id", loggerMetadata);
  let event: IEvent | null;
  try {
    event = await DALEvent.getEvent(id);
    if (!event) {
      logger.info("Event not found", loggerMetadata);
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    logger.info("An error occurred while getting event", loggerMetadata);
    return res.status(400).json({ message: "An error occurred while getting event" });
  }
};

export const getEventsForFeed = async (req: Request, res: Response): Promise<Response> => {
  const user = req.user as IPhotographer;
  const userId = user?.id as string;
  const page = req.query.page as string;
  const loggerMetadata = {
    function: "getEventsForFeed",
    userId,
    page,
  };

  if (!userId) {
    logger.info("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }

  logger.info("Getting all events for feed", loggerMetadata);
  try {
    const feedResponse = await DALEvent.getEventsForFeed({ userId, page });
    return res.status(200).json(feedResponse);
  } catch (error) {
    logger.info("An error occurred while getting events", loggerMetadata);
    return res.status(500).json({ message: "An error occurred while getting events" });
  }
};

/**
 * @description - gets all events for a photographer
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getUserCreatedEvents = async (req: Request, res: Response): Promise<Response> => {
  const user = req.user as IPhotographer;
  const userId = user?.id as string;
  const loggerMetadata = {
    function: "getEvents",
    userId,
  };
  if (!userId) {
    logger.info("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  logger.info("Getting all events for user", loggerMetadata);
  let events: EventDocument[] | null;
  try {
    events = await DALEvent.getEventsByPhotographer(userId);
    return res.status(200).json(events);
  } catch (error) {
    logger.info("An error occurred while getting events", loggerMetadata);
    return res.status(500).json({ message: "An error occurred while getting events" });
  }
};

/**
 * @description - creates a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const createEvent = async (req: Request, res: Response): Promise<Response> => {
  const event = req.body;
  const user = req.user as IPhotographer;
  const loggerMetadata = {
    function: "createEvent",
    userId: user.id,
  };
  logger.info("Creating event", loggerMetadata);
  let newEvent: IEvent;
  try {
    newEvent = await DALEvent.create({ photographer: user.id, ...event });
    return res.status(201).json(newEvent);
  } catch (error) {
    logger.error("Error creating event", { ...loggerMetadata, error: error as Error });
    return res.status(500).json({ message: "Error creating event" });
  }
};

/**
 * @description - updates a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updateEvent = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const user = req.user as IPhotographer;
  const loggerMetadata = {
    function: "updateEvent",
    eventId: id,
    userId: user?.id || "unauthorized",
  };
  if (!user || !user.id) {
    logger.info("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  logger.info("Updating event", loggerMetadata);
  const event = req.body as Partial<IEvent>;
  try {
    await DALEvent.update(id, event);
    if (!event) {
      logger.info("Event not found", loggerMetadata);
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ event, message: "Event updated" });
  } catch (error) {
    logger.error("Error updating event", { ...loggerMetadata, error: error as Error });
    return res.status(500).json({ message: "Error updating event" });
  }
};

/**
 * @description - deletes a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const deleteEvent = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const user = req.user as IPhotographer;
  const loggerMetadata = {
    function: "deleteEvent",
    eventId: id,
    userId: user?.id || "unauthorized",
  };
  if (!user || !user.id) {
    logger.info("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  logger.info("Looking up event to be deleted", loggerMetadata);
  try {
    const event = await DALEvent.getEvent(id);
    if (!event) {
      logger.info("Event not found", loggerMetadata);
      return res.status(404).json({ message: "Event not found" });
    }
    logger.info("Checking if user is authorized to delete event", { ...loggerMetadata, event });
    if (event?.photographer.id !== user.id) {
      logger.info("Unauthorized", loggerMetadata);
      return res.status(401).json({ message: "Unauthorized" });
    }
    logger.info("Soft deleting event", loggerMetadata);
    const deletedEvent = await DALEvent.softDelete(id);
    logger.info("Soft delete succesful", loggerMetadata);
    return res.status(200).json({ event: deletedEvent, message: "Event Deleted" });
  } catch (error) {
    logger.error("Error deleting event", { ...loggerMetadata, error: error as Error });
    return res.status(500).json({ message: "Error deleting event" });
  }
};

/**
 * @description - adds a comment to a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const addComment = async (req: Request, res: Response): Promise<Response> => {
  const text = req.body.text;
  const user = req.user as IPhotographer;
  const userId = user?.id as string;
  const eventId = req.params.id;
  const loggerMetadata = {
    function: "addComment",
    userId,
    eventId,
  };
  if (!userId) {
    logger.info("Unauthorized", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!text) {
    logger.info("Missing text", loggerMetadata);
    return res.status(400).json({ message: "Missing text" });
  }
  logger.info("creating comment", loggerMetadata);
  try {
    const newComment = await (
      await DALEventComment.create({ text, photographer: userId, event: eventId })
    ).populate("photographer");
    return res.status(201).json(newComment);
  } catch (error) {
    logger.error("Error adding comment to event", { ...loggerMetadata, error: error as Error });
    return res.status(500).json({ message: "Error adding comment to event" });
  }
};
