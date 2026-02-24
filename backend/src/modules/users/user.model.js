const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["landlord", "admin"],
      default: "landlord"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "expired"],
      default: "inactive"
    },
    subscriptionExpiresAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);