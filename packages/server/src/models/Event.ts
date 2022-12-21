// Event model

import mongoose, { Document } from "mongoose";
import { IPhotographer } from "./Photographer";

const Schema = mongoose.Schema;

export type IEvent = {
  photographer: IPhotographer;
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  isDeleted?: boolean;
  isFulfilled?: boolean;
  dateCreated?: Date;
};

export type EventDocument = IEvent & Document;

const EventSchema = new Schema({
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
  time: {
    type: String,
    required: true,
  },
  isFulfilled: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<EventDocument>("Event", EventSchema);
