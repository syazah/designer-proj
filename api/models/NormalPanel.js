import mongoose from "mongoose";

const NormalPanelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  glass: {
    type: String,
    default: "#000",
  },
  frame: {
    type: String,
    default: "#ab936b",
  },
  variant: {
    type: mongoose.Schema.Types.Mixed,
  },
});

export const NormalPanel = mongoose.model("NormalPanel", NormalPanelSchema);
