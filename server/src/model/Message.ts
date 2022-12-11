// Message model
import mongoose, { Document } from "mongoose";
import { IPhotographer } from "./Photographer";

const Schema = mongoose.Schema;

export interface IMessage {
  sender: IPhotographer;
  recipient: IPhotographer;
  message: string;
  date?: Date;
  isRead?: boolean;
  reactions?: string[];
}

export interface IMessageDocument extends IMessage, Document {}

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "Photographer",
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "Photographer",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  reactions: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IMessageDocument>("Message", MessageSchema);
