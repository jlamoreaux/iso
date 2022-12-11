// Gear mongoose model
import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
export default mongoose.model("Gear", GearSchema);
