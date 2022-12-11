var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DALMessage from "../data/message";
import logger from "../utils/logger";
/**
 * @description - gets a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "getMessage",
        messageId: id,
    };
    logger.info("Getting message by id", loggerMetadata);
    let message;
    try {
        message = yield DALMessage.findById(id);
    }
    catch (error) {
        logger.info("Message not found", loggerMetadata);
        return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
});
/**
 * @description - gets all messages
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photographerId = req.params.photographerId;
    const loggerMetadata = {
        function: "getMessages",
        photographerId,
    };
    logger.info("Getting all messages for user", loggerMetadata);
    let messages;
    try {
        messages = yield DALMessage.findByPhotographer(photographerId);
    }
    catch (error) {
        logger.info("Messages not found", loggerMetadata);
        return res.status(404).json({ message: "Messages not found" });
    }
    return res.status(200).json(messages);
});
/**
 * @description - creates a message
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggerMetadata = {
        function: "createMessage",
        message: req.body,
    };
    logger.info("Creating message", loggerMetadata);
    let message;
    try {
        message = yield DALMessage.create(req.body);
    }
    catch (error) {
        logger.info("Error creating message", loggerMetadata);
        return res.status(404).json({ message: "Error creating message" });
    }
    return res.status(200).json(message);
});
/**
 * @description - updates a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "updateMessage",
        messageId: id,
        message: req.body,
    };
    logger.info("Updating message", loggerMetadata);
    let message;
    try {
        message = yield DALMessage.update(id, req.body);
    }
    catch (error) {
        logger.info("Message not found", loggerMetadata);
        return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
});
/**
 * @description - deletes a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "deleteMessage",
        messageId: id,
    };
    logger.info("Deleting message", loggerMetadata);
    let message;
    try {
        message = yield DALMessage.delete(id);
    }
    catch (error) {
        logger.info("Message not found", loggerMetadata);
        return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
});
