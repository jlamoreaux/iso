// Photographer Model
import mongoose, { Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { IGear } from "./Gear";

const Schema = mongoose.Schema;

export interface IPhotographer {
  firstName: string;
  lastName: string;
  password?: string;
  company?: string;
  email: string;
  authType: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  gear?: IGear;
  availability?: Date[];
  regions?: string[];
  profilePic?: string;
  bio?: string;
  isTrial?: boolean;
  isPro?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  isSuspended?: boolean;
  isDeleted?: boolean;
  dateCreated?: Date;
}

export interface IPhotographerDocument extends IPhotographer, Document {
  verifyPassword: (password: string, callback: (err: any, isMatch: boolean) => void) => void;
  isValidPassword: (password: string) => Promise<boolean>;
}

interface PhotographerModel extends Model<IPhotographerDocument> {
  register: (
    photographer: IPhotographer,
    password: string,
    callback: (err: any, photographer: IPhotographer) => void,
  ) => IPhotographerDocument;
  authenticate: () => LocalStrategy;
  findByEmail: (email: string) => Promise<IPhotographerDocument>;
  serializeUser: () => PhotographerModel;
  deserializeUser: () => PhotographerModel;
}

const PhotographerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  authType: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  zip: {
    type: String,
    required: false,
  },
  gear: {
    type: Schema.Types.ObjectId,
    ref: "Gear",
    required: false,
  },
  availability: {
    type: [Date],
    required: false,
  },
  regions: {
    type: [String],
    required: false,
  },
  profilePic: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  isTrial: {
    type: Boolean,
    default: true,
  },
  isPro: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isSuspended: {
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

// Add passportLocalMongoose to the schema
PhotographerSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// static isValidPassword method
PhotographerSchema.methods.isValidPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

// static findByUsername method
PhotographerSchema.statics.findByUsername = async function (username: string) {
  return this.findOne({ username });
};

export default mongoose.model<IPhotographer, PhotographerModel>("Photographer", PhotographerSchema);
