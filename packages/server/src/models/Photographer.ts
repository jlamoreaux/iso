// Photographer Model
import mongoose, { Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { IGear } from "./Gear";
import { Region } from "../utils/regions";

const Schema = mongoose.Schema;

type SerializedUser = {
  id: string;
  firstName: string;
  company?: string;
  profilePic?: string;
};

export type IPhotographer = {
  id?: string;
  username: string;
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
  regions?: Region[];
  profilePic?: string;
  portfolioImages?: string[];
  bio?: string;
  favorites: { [photographerId: string]: boolean };
  isFavorite?: boolean;
  isTrial?: boolean;
  isPro?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  isSuspended?: boolean;
  isDeleted?: boolean;
  dateCreated?: Date;
};

export type PhotographerDocument = IPhotographer &
  Document & {
    verifyPassword: (password: string, callback: (err: any, isMatch: boolean) => void) => void;
    isValidPassword: (password: string) => Promise<boolean>;
    getFavorites: () => Promise<PhotographerDocument[]>;
    checkIfIsFavorite: (photographerId: string) => Promise<boolean>;
  };

export interface PhotographerModel extends Model<PhotographerDocument> {
  register: (
    photographer: IPhotographer,
    password: string,
    callback: (err: any, photographer: PhotographerDocument) => void,
  ) => PhotographerDocument;
  authenticate: () => LocalStrategy;
  findByEmail: (email: string) => Promise<PhotographerDocument>;
  serializeUser: () => PhotographerModel;
  deserializeUser: () => PhotographerModel;
}

const PhotographerSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
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
    type: [{ state: String, city: String }],
    required: false,
  },
  profilePic: {
    type: String,
    required: false,
  },
  portfolioImages: {
    type: [String],
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  favorites: {
    type: Map,
    of: String,
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

// static isValidPassword method
PhotographerSchema.methods.isValidPassword = async function (password: string) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

// getFavoritePhotographers method
PhotographerSchema.methods.getFavorites = async function () {
  const favorites = Array.from(this.favorites.keys()) as string[];
  const photographers = this.model("Photographer").find({
    _id: { $in: favorites },
  });
  return photographers;
};

// isFavorite method
PhotographerSchema.methods.checkIfIsFavorite = async function (photographerId: string) {
  return this.favorites.get(photographerId);
};

PhotographerSchema.statics = {
  // serializeUser method
  serializeUser: () => {
    return (user: PhotographerDocument, done: (err: any, id: SerializedUser) => void) => {
      done(null, {
        id: user.id,
        profilePic: user.profilePic,
        firstName: user.firstName,
        company: user.company,
      });
    };
  },
  // static findByUsername method
  findByUsername: async function (username: string) {
    return this.findOne({ username });
  },
};

PhotographerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

PhotographerSchema.set("toJSON", {
  virtuals: true,
});

// Add passportLocalMongoose to the schema
PhotographerSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export default mongoose.model<PhotographerDocument, PhotographerModel>(
  "Photographer",
  PhotographerSchema,
);
