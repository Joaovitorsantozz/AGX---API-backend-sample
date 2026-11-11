import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "returned"],
      default: "active",
    },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
