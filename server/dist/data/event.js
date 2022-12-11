var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Event from "../model/Event";
const DALEvent = {
    getEvent: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.findById(id);
    }),
    createEvent: (event) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.create(event);
    }),
    updateEvent: (id, event) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.findByIdAndUpdate(id, event, {
            new: true,
        });
    }),
    deleteEvent: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.findByIdAndRemove(id);
    }),
    getEventsByPhotographer: (photographerId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.find({
            photographer: photographerId,
        });
    }),
    getEventsByRegionAndDate: (region, date) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.find({
            region,
            date,
        });
    }),
    getEventsByRegion: (region) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Event.find({
            region,
        });
    }),
};
export default DALEvent;
