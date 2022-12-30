// Data Access Layer for Message
import { Types } from "mongoose";
import Message, { IMessage, IMessageDocument } from "../models/Message";

const DALMessage = {
  create: async (message: IMessage): Promise<IMessageDocument> => {
    return await Message.create(message);
  },
  update: async (
    id: string,
    messageUpdate: Partial<IMessage>,
  ): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndUpdate(id, messageUpdate, {
      new: true,
    });
  },
  delete: async (id: string): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndRemove(id);
  },
  findById: async (id: string | Types.ObjectId): Promise<IMessageDocument | null> => {
    return await Message.findById(id).populate("sender").populate("replies");
  },
  findByIdAndSender: async (
    id: string,
    photographerId: string,
  ): Promise<IMessageDocument | null> => {
    return await Message.findOne({ _id: id, sender: photographerId });
  },
  findBySender: async (photographerId: string): Promise<IMessageDocument[]> => {
    return await Message.find({ sender: photographerId });
  },
  findByRecipient: async (photographerId: string): Promise<IMessageDocument[]> => {
    return await Message.find({ recipient: photographerId }).populate("sender");
  },
  findRootMessagesByRecipient: async (photographerId: string): Promise<IMessageDocument[]> => {
    return await Message.find({ recipient: photographerId, replyTo: null }).populate("sender");
  },
  updateAsRead: async (id: string): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  },
  addReply: async (
    id: string | Types.ObjectId,
    reply: IMessageDocument,
  ): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndUpdate(
      id,
      { $push: { replies: reply.id }, $set: { lastReply: reply.createdAt } },
      { new: true },
    );
  },
};

export default DALMessage;
