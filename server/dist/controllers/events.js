var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DALEvent from "../data/event";
import logger from "../utils/logger";
/**
 * @description - gets a event with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "getEvent",
        eventId: id,
    };
    logger.info("Getting event by id", loggerMetadata);
    let event;
    try {
        event = yield DALEvent.getEvent(id);
    }
    catch (error) {
        logger.info("Event not found", loggerMetadata);
        return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
});
/**
 * @description - gets all events for a photographer
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photographerId = req.params.photographerId;
    const loggerMetadata = {
        function: "getEvents",
        photographerId,
    };
    logger.info("Getting all events for user", loggerMetadata);
    let events;
    try {
        events = yield DALEvent.getEventsByPhotographer(photographerId);
    }
    catch (error) {
        logger.info("Events not found", loggerMetadata);
        return res.status(404).json({ message: "Events not found" });
    }
    return res.status(200).json(events);
});
/**
 * @description - creates a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggerMetadata = {
        function: "createEvent",
        event: req.body,
    };
    logger.info("Creating event", loggerMetadata);
    const event = req.body;
    let newEvent;
    try {
        newEvent = yield DALEvent.createEvent(event);
    }
    catch (error) {
        logger.error("Error creating event", Object.assign(Object.assign({}, loggerMetadata), { error }));
        return res.status(500).json({ message: "Error creating event" });
    }
    return res.status(201).json(newEvent);
});
/**
 * @description - updates a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "updateEvent",
        eventId: id,
        event: req.body,
    };
    logger.info("Updating event", loggerMetadata);
    const event = req.body;
    try {
        yield DALEvent.updateEvent(id, event);
    }
    catch (error) {
        logger.error("Error updating event", Object.assign(Object.assign({}, loggerMetadata), { error }));
        return res.status(500).json({ message: "Error updating event" });
    }
    return res.status(200).json({ message: "Event updated" });
});
/**
 * @description - deletes a event
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "deleteEvent",
        eventId: id,
    };
    logger.info("Deleting event", loggerMetadata);
    try {
        yield DALEvent.deleteEvent(id);
    }
    catch (error) {
        logger.error("Error deleting event", Object.assign(Object.assign({}, loggerMetadata), { error }));
        return res.status(500).json({ message: "Error deleting event" });
    }
    return res.status(200).json({ message: "Event deleted" });
});
