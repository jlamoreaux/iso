var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Data Access Layer for Message
import Message from "../model/Message";
const DALMessage = {
    create: (message) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Message.create(message);
    }),
    update: (id, message) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Message.findByIdAndUpdate(id, message, {
            new: true,
        });
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Message.findByIdAndRemove(id);
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Message.findById(id);
    }),
    findByPhotographer: (photographerId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Message.find({
            $or: [{ recipient: photographerId }, { sender: photographerId }],
        });
    }),
    updateAsRead: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Message.findByIdAndUpdate(id, { read: true }, { new: true });
    }),
};
export default DALMessage;
