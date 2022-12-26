// Message model
import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IMessage {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  message: string;
  eventTitle?: string;
  eventType?: string;
  eventLocation?: string;
  eventDescription?: string;
  eventDate?: Date;
  createdAt: Date;
  isRead: boolean;
  reactions?: string[];
  replyTo?: Types.ObjectId;
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
  eventTitle: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: false,
  },
  eventLocation: {
    type: String,
    required: false,
  },
  eventDescription: {
    type: String,
    required: false,
  },
  eventDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  reactions: {
    type: [String],
    required: false,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: false,
  },
});

MessageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

MessageSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<IMessageDocument>("Message", MessageSchema);
