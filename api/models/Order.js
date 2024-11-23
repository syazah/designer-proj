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
    currentStage: {
      type: String,
      default: "Admin",
      enum: ["Admin", "Sale", "Manufacturer"],
    },
    detailedStage: {
      type: String,
      default: null,
    },
    assignedTo: {
      type: Mongoose.Schema.Types.ObjectId,
      refPath: "currentStage",
    },
    worker: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
    quotationCost: {
      type: Number,
    },
    orderCompletedImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = Mongoose.model("Order", OrderSchema);
