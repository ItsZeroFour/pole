import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village"
    },

    stockItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemStock"
    },

    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock"
    },

    agent: {
      type: String,
      required: true,
    },

    culture: {
      type: String,
      required: true,
    },

    count: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("shipment", shipmentSchema)
