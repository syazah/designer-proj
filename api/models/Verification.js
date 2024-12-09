import mongoose from "mongoose";

const VerifySchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    otpFor: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Verification = mongoose.model("Verification", VerifySchema);
