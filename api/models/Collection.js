import mongoose from "mongoose";

const CollectionModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    panels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Panel",
    },
    normalPanels: [
      {
        panelID: { type: mongoose.Schema.Types.ObjectId, ref: "NormalPanel" },
        panelFrame: String,
        panelGlass: String,
        panelWall: String,
      },
    ],
  },
  { timestamps: true }
);

export const Collection = mongoose.model("Collection", CollectionModel);
