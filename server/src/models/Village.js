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
});

export default mongoose.model("Village", villageSchema);
