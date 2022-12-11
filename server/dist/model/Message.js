// Message model
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Photographer",
        required: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "Photographer",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    reactions: {
        type: [String],
        required: false,
    },
});
export default mongoose.model("Message", MessageSchema);
