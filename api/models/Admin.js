import mongoose, { Schema } from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
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
  isAdmin: {
    type: Boolean,
    default: true,
  },
  isBusiness: {
    type: Boolean,
    default: false,
  },
  createdPanels: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Panel",
  },
  createdBusinesses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Business",
  },
  createdUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

export const Admin = mongoose.model("Admin", AdminSchema);
