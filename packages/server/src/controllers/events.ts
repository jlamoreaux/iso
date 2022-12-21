// Events controller
import { Request, Response } from "express";
import { IEvent, EventDocument } from "../models/Event";
import DALEvent from "../data/event";
import logger from "../utils/logger";

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
  let event: EventDocument | null;
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

/**
 * @description - gets all events for a photographer
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getEvents = async (req: Request, res: Response): Promise<Response> => {
  const photographerId = req.query.photographerId as string;
  const loggerMetadata = {
    function: "getEvents",
    photographerId,
  };
  logger.info("Getting all events for user", loggerMetadata);
  let events: EventDocument[] | null;
  try {
    events = await DALEvent.getEventsByPhotographer(photographerId);
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
  const loggerMetadata = {
    function: "createEvent",
    event: req.body,
  };
  logger.info("Creating event", loggerMetadata);
  const event = req.body as IEvent;
  let newEvent: EventDocument;
  try {
    newEvent = await DALEvent.create(event);
    return res.status(201).json(newEvent);
  } catch (error) {
    logger.error("Error creating event", { ...loggerMetadata, error });
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
  const loggerMetadata = {
    function: "updateEvent",
    eventId: id,
    event: req.body,
  };
  logger.info("Updating event", loggerMetadata);
  const event = req.body as IEvent;
  try {
    await DALEvent.update(id, event);
    if (!event) {
      logger.info("Event not found", loggerMetadata);
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ event, message: "Event updated" });
  } catch (error) {
    logger.error("Error updating event", { ...loggerMetadata, error });
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
  const loggerMetadata = {
    function: "deleteEvent",
    eventId: id,
  };
  logger.info("Deleting event", loggerMetadata);
  try {
    const event = await DALEvent.delete(id);
    if (!event) {
      logger.info("Event not found", loggerMetadata);
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ event, message: "Event deleted" });
  } catch (error) {
    logger.error("Error deleting event", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error deleting event" });
  }
};
