import mongoose from "mongoose";

const ManufactureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Order",
    },
  },
  { timestamps: true }
);

export const Manufacturer = mongoose.model("Manufacturer", ManufactureSchema);
