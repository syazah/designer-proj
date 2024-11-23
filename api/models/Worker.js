import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer",
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
  },
});

export const Worker = mongoose.model("Worker", WorkerSchema);
