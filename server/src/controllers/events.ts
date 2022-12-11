// Events controller
import { Request, Response } from "express";
import { IEvent, IEventDocument } from "../model/Event";
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
  let event: IEventDocument | null;
  try {
    event = await DALEvent.getEvent(id);
  } catch (error) {
    logger.info("Event not found", loggerMetadata);
    return res.status(404).json({ message: "Event not found" });
  }
  return res.status(200).json(event);
};

/**
 * @description - gets all events for a photographer
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getEvents = async (req: Request, res: Response): Promise<Response> => {
  const photographerId = req.params.photographerId;
  const loggerMetadata = {
    function: "getEvents",
    photographerId,
  };
  logger.info("Getting all events for user", loggerMetadata);
  let events: IEventDocument[] | null;
  try {
    events = await DALEvent.getEventsByPhotographer(photographerId);
  } catch (error) {
    logger.info("Events not found", loggerMetadata);
    return res.status(404).json({ message: "Events not found" });
  }
  return res.status(200).json(events);
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
  let newEvent: IEventDocument;
  try {
    newEvent = await DALEvent.createEvent(event);
  } catch (error) {
    logger.error("Error creating event", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error creating event" });
  }
  return res.status(201).json(newEvent);
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
    await DALEvent.updateEvent(id, event);
  } catch (error) {
    logger.error("Error updating event", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error updating event" });
  }
  return res.status(200).json({ message: "Event updated" });
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
    await DALEvent.deleteEvent(id);
  } catch (error) {
    logger.error("Error deleting event", { ...loggerMetadata, error });
    return res.status(500).json({ message: "Error deleting event" });
  }
  return res.status(200).json({ message: "Event deleted" });
};
