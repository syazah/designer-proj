import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    objectID: {
      type: String,
      required: true,
    },
    minimum: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model("Inventory", InventorySchema);
