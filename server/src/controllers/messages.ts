// Message Controller
import { Request, Response } from "express";
import { IMessageDocument } from "../model/Message";
import DALMessage from "../data/message";
import logger from "../utils/logger";

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
  } catch (error) {
    logger.info("Message not found", loggerMetadata);
    return res.status(404).json({ message: "Message not found" });
  }
  return res.status(200).json(message);
};

/**
 * @description - gets all messages
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const getMessages = async (req: Request, res: Response): Promise<Response> => {
  const photographerId = req.params.photographerId;
  const loggerMetadata = {
    function: "getMessages",
    photographerId,
  };
  logger.info("Getting all messages for user", loggerMetadata);
  let messages: IMessageDocument[] | null;
  try {
    messages = await DALMessage.findByPhotographer(photographerId);
  } catch (error) {
    logger.info("Messages not found", loggerMetadata);
    return res.status(404).json({ message: "Messages not found" });
  }
  return res.status(200).json(messages);
};

/**
 * @description - creates a message
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const createMessage = async (req: Request, res: Response): Promise<Response> => {
  const loggerMetadata = {
    function: "createMessage",
    message: req.body,
  };
  logger.info("Creating message", loggerMetadata);
  let message: IMessageDocument;
  try {
    message = await DALMessage.create(req.body);
  } catch (error) {
    logger.info("Error creating message", loggerMetadata);
    return res.status(404).json({ message: "Error creating message" });
  }
  return res.status(200).json(message);
};

/**
 * @description - updates a message with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updateMessage = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const loggerMetadata = {
    function: "updateMessage",
    messageId: id,
    message: req.body,
  };
  logger.info("Updating message", loggerMetadata);
  let message: IMessageDocument | null;
  try {
    message = await DALMessage.update(id, req.body);
  } catch (error) {
    logger.info("Message not found", loggerMetadata);
    return res.status(404).json({ message: "Message not found" });
  }
  return res.status(200).json(message);
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
  } catch (error) {
    logger.info("Message not found", loggerMetadata);
    return res.status(404).json({ message: "Message not found" });
  }
  return res.status(200).json(message);
};
