// Gear mongoose model
import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IGear extends Document {
  brand: string;
  lenses: string;
  body: string;
  flash: string;
  comments: string;
}

const GearSchema = new Schema({
  brand: {
    type: [String],
    required: true,
  },
  lenses: {
    type: [String],
    required: false,
  },
  body: {
    type: [String],
    required: false,
  },
  flash: {
    type: [String],
    required: false,
  },
  comments: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IGear>("Gear", GearSchema);
