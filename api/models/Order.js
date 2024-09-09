import Mongoose from "mongoose";

const OrderSchema = new Mongoose.Schema(
  {
    raisedBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    panelData: {
      type: Mongoose.Schema.Types.Mixed,
      required: true,
    },
    referenceNumber: {
      type: String,
      required: true,
    },
    pdfLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = Mongoose.model("Order", OrderSchema);
