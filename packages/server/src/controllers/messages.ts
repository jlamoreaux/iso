// Message Controller
import { Request, Response } from "express";
import { IMessageDocument } from "../models/Message";
import DALMessage from "../data/message";
import logger from "../utils/logger";
import { IPhotographer } from "../models/Photographer";

/**
 * @description - gets a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getMessage = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const loggerMetadata = {
    function: "getMessage",
    messageId: id,
  };
  logger.info("Getting message by id", loggerMetadata);
  let message: IMessageDocument | null;
  try {
    message = await DALMessage.findById(id);
    if (!message) {
      logger.info("Message not found", loggerMetadata);
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
  } catch (error) {
    logger.warn("An error occurred while searching for the message", loggerMetadata);
    return res.status(400).json({ message: "An error occurred while searching for the message" });
  }
};

/**
 * @description - gets all messages
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getMessages = async (req: Request, res: Response): Promise<Response> => {
  let loggerMetadata = {
    function: "getMessages",
  };
  const photographer = req.user as IPhotographer;
  if (!photographer || !photographer.id) {
    logger.info("Unauthorized request", loggerMetadata);
    return res.status(401).json({ message: "Unauthorized request" });
  }
  const photographerId = photographer.id;
  logger.info("Getting all messages for user", { ...loggerMetadata, photographerId });
  let messages: IMessageDocument[] | null;
  try {
    messages = await DALMessage.findByRecipient(photographerId);
    if (!messages) {
      logger.info("Messages not found", loggerMetadata);
      return res.status(404).json({ message: "Messages not found" });
    }
    return res.status(200).json(messages);
  } catch (error) {
    logger.info("Messages not found", loggerMetadata);
    return res.status(404).json({ message: "Messages not found" });
  }
};

/**
 * @description - creates a message
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const createMessage = async (req: Request, res: Response): Promise<Response> => {
  const messageData = req.body;
  const sender = req.user as IPhotographer;
  const loggerMetadata = {
    function: "createMessage",
    message: messageData,
  };
  console.log(messageData);
  if (!messageData || !messageData.message) {
    logger.info("Invalid request", loggerMetadata);
    return res.status(400).json({ message: "Message is required" });
  }
  messageData.sender = sender.id;
  logger.info("Creating message", loggerMetadata);
  let message: IMessageDocument;
  try {
    message = await DALMessage.create(req.body);
    return res.status(201).json(message);
  } catch (error) {
    logger.info("Error creating message", { ...loggerMetadata, error });
    return res.status(404).json({ message: "Error creating message" });
  }
};

/**
 * @description - updates a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updateMessage = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const loggedInUser = req.user as IPhotographer;
  if (!id) return res.status(400).json({ message: "Message id is required" });
  if (!loggedInUser || !loggedInUser.id)
    return res.status(401).json({ message: "Unauthorized request" });
  const loggerMetadata = {
    function: "updateMessage",
    messageId: id,
    message: req.body,
  };
  if (!req.body) {
    logger.info("Invalid request", loggerMetadata);
    return res.status(400).json({ message: "Message is required" });
  }

  logger.info("Updating message", loggerMetadata);
  let messageToUpdate: IMessageDocument | null;
  try {
    messageToUpdate = await DALMessage.findByIdAndSender(id, loggedInUser.id);
    if (!messageToUpdate) {
      logger.info("Message not found", loggerMetadata);
      return res.status(404).json({ message: "Message not found" });
    }
    messageToUpdate = await DALMessage.update(id, req.body);
    return res.status(200).json(messageToUpdate);
  } catch (error) {
    logger.info("Error when updating message", { ...loggerMetadata, error });
    return res.status(404).json({ message: "Error when updating message" });
  }
};

/**
 * @description - deletes a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */

export const deleteMessage = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const loggerMetadata = {
    function: "deleteMessage",
    messageId: id,
  };
  logger.info("Deleting message", loggerMetadata);
  let message: IMessageDocument | null;
  try {
    message = await DALMessage.delete(id);
    if (!message) {
      logger.info("Message not found", loggerMetadata);
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(204);
  } catch (error) {
    logger.info("Error deleting message", loggerMetadata);
    return res.status(500).json({ message: "Error deleting message" });
  }
};
