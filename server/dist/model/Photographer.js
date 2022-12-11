var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Photographer Model
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
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
PhotographerSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt.compare(password, this.hashedPassword);
        return result;
    });
};
// static findByUsername method
PhotographerSchema.statics.findByUsername = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({ username });
    });
};
export default mongoose.model("Photographer", PhotographerSchema);
