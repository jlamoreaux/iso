// Message model
import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IMessage {
  id?: string;
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
  isRootMessage: boolean;
  replies?: Types.ObjectId[] | IMessage[];
  lastReply?: Date;
  replyTo?: Types.ObjectId;
  hasUnreadReplies?: boolean;
  lastReadReplyId?: string;
}

export type IMessageDocument = IMessage & Document;

const MessageSchema = new Schema(
  {
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
    isRead: {
      type: Boolean,
      default: false,
    },
    reactions: {
      type: [String],
      required: false,
    },
    isRootMessage: {
      type: Boolean,
      default: function (this: IMessageDocument) {
        return !this.replyTo;
      },
      required: true,
    },
    lastReply: {
      type: Date,
      required: function (this: IMessageDocument) {
        return this.isRootMessage;
      },
      default: Date.now,
    },
    replies: {
      type: [Schema.Types.ObjectId],
      ref: "Message",
      required: false,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: [
        function (this: IMessageDocument) {
          return !this.isRootMessage;
        },
        "ReplyTo is required for root messages",
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Automatically populate the sender field
MessageSchema.pre("find", function (this: any) {
  this.populate("sender", "firstName lastName profilePic city state id");
});

MessageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

MessageSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<IMessageDocument>("Message", MessageSchema);
