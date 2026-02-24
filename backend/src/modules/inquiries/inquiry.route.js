const express = require("express");
const router = express.Router();
const { inquiryLimiter } = require("../../middleware/rateLimit.middleware");



const {
  createInquiry,
  getMyInquiries
} = require("./inquiry.controller");

const { protect } = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");

// Public
router.post("/", createInquiry);

// Landlord
router.get(
  "/landlord",
  protect,
  requireRole("landlord"),
  getMyInquiries
);

router.post("/", inquiryLimiter, createInquiry);

module.exports = router;