import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    businessCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      unique: true,
    },
    tier: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBusiness: {
      type: Boolean,
      default: true,
    },
    clientsCreated: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "panel",
    },
    orderRaised: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", BusinessSchema);
