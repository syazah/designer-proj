import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
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
    country: {
      type: String,
    },
    city: {
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
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel"
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Business", "Admin"], // Only allow these two models
    },
    panelsCreated: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Panel",
    },
    ordersRaised: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Panel",
    },
    collectionsCreated: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Collection",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
