// Data Access Layer for Message
import Message, { IMessage, IMessageDocument } from "../model/Message";

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
    return await Message.findById(id);
  },
  findByPhotographer: async (photographerId: string): Promise<IMessageDocument[]> => {
    return await Message.find({
      $or: [{ recipient: photographerId }, { sender: photographerId }],
    });
  },
  updateAsRead: async (id: string): Promise<IMessageDocument | null> => {
    return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  },
};

export default DALMessage;
