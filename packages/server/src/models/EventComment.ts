// Mongoose Model: EventComment

import { Schema, model, Document } from "mongoose";
import Event, { IEvent } from "./Event";
import { IPhotographer } from "./Photographer";

export interface IEventComment {
  photographer: IPhotographer | string;
  event: IEvent | string;
  text: string;
  isDeleted?: boolean;
  dateCreated?: Date;
}

export type EventCommentDocument = IEventComment & Document;

const EventCommentSchema = new Schema(
  {
    photographer: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Virtuals
EventCommentSchema.set("toJSON", {
  virtuals: true,
});

EventCommentSchema.pre("find", function (this: any) {
  this.populate("photographer", "firstName lastName profilePic id");
});

EventCommentSchema.pre("save", async function (this: EventCommentDocument, next: () => void) {
  if (this.isNew) {
    const event = await Event.findById(this.event);
    if (event) {
      if (!event.comments) event.comments = [];
      event.comments.push(this._id);
      await event.save();
    }
  }
  next();
});

EventCommentSchema.virtual("id").get(function (this: EventCommentDocument) {
  return this._id.toHexString();
});

// Methods

// Statics
EventCommentSchema.statics.findByEventId = async function (eventId: string) {
  return this.find({ event: eventId }); // Return all comments for the event
};

EventCommentSchema.statics.findByPhotographerId = async function (photographerId: string) {
  return this.find({ photographer: photographerId }); // Return all comments for the photographer
};

const EventComment = model<EventCommentDocument>("EventComment", EventCommentSchema);

export default EventComment;
