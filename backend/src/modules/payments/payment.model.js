const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    reference: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    method: {
      type: String,
      default: "paystack"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);