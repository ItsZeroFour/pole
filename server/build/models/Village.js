import mongoose from "mongoose";
const villageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    stocks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
        },
    ],
    shipment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "shipment",
        },
    ],
});
export default mongoose.model("Village", villageSchema);
//# sourceMappingURL=Village.js.map