// Event model

import mongoose, { Document, Types } from "mongoose";
import { IEventComment } from "./EventComment";
import { IPhotographer } from "./Photographer";

const Schema = mongoose.Schema;

export type IEvent = {
  photographer: IPhotographer;
  title: string;
  description: string;
  location: string;
  date: Date;
  rate?: number;
  comments?: Types.ObjectId[] | IEventComment[];
  isDeleted?: boolean;
  isFulfilled?: boolean;
  createdAt?: Date;
};

export type EventDocument = IEvent & Document;

const EventSchema = new Schema(
  {
    photographer: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isFulfilled: {
      type: Boolean,
      default: false,
    },
    rate: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "EventComment",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Automatically populate the sender field
EventSchema.pre("find", function (this: any) {
  this.populate("photographer", "firstName lastName profilePic id");
});

// Populate the comments field for a single event
EventSchema.pre("findOne", function (this: any) {
  this.populate("comments", "text createdAt photographer");
  this.populate("photographer", "firstName lastName profilePic id");
});

EventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

EventSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

EventSchema.set("toJSON", {
  virtuals: true,
});

EventSchema.index({ title: "text", description: "text" });

export default mongoose.model<EventDocument>("Event", EventSchema);
