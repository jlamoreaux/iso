// Event model
import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
export default mongoose.model("Event", EventSchema);
