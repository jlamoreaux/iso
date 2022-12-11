var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Description: This file contains the data access layer for the photographers
import logger from "../utils/logger";
import Photographer from "../model/Photographer";
const DALPhotographer = {
    register: (photographer, callback) => __awaiter(void 0, void 0, void 0, function* () {
        yield Photographer.register(photographer, photographer.password, callback);
    }),
    verify: (email, password, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const photographer = yield Photographer.findOne({ email }).exec();
            if (photographer) {
                photographer.verifyPassword(password, (err, isMatch) => {
                    if (err) {
                        return callback(err, null);
                    }
                    else if (isMatch) {
                        return callback(null, photographer);
                    }
                    else {
                        return callback(new Error("Invalid password"), null);
                    }
                });
            }
            else {
                return callback(new Error("User not found"), null);
            }
        }
        catch (err) {
            logger.error({ function: "DALPhotographer.verify", error: err });
            return callback(err, null);
        }
    }),
    update: (id, photographer) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Photographer.findByIdAndUpdate(id, photographer, { new: true }).exec();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Photographer.findById(id).exec();
    }),
    findByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Photographer.findOne({ email }).exec();
    }),
    findByRegion: (region) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Photographer.find({ regions: region }).exec();
    }),
    findByRegionAndAvailability: (region, date) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Photographer.find({ regions: region, availability: { $ne: date } }).exec();
    }),
    deletePhotographer: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Photographer.findByIdAndDelete(id).exec();
    }),
};
export default DALPhotographer;
