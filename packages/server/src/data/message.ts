// Data Access Layer for Message
import Message, { IMessage, IMessageDocument } from "../models/Message";

const DALMessage = {
  create: async (message: IMessage): Promise<IMessageDocument> => {
    return await Message.create(message);
  },
  update: async (id: string, message: IMessage): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndUpdate(id, message, {
      new: true,
    });
  },
  delete: async (id: string): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndRemove(id);
  },
  findById: async (id: string): Promise<IMessageDocument | null> => {
    return await Message.findById(id).populate("sender");
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
  updateAsRead: async (id: string): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  },
};

export default DALMessage;
