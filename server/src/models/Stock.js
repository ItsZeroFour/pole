import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemStock",
    },
  ],
});

export default mongoose.model("Stock", stockSchema);
