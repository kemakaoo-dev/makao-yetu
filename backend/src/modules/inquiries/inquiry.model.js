const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tenantName: {
      type: String,
      required: true
    },
    tenantEmail: {
      type: String,
      required: true
    },
    tenantPhone: {
        type: String,
        required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);