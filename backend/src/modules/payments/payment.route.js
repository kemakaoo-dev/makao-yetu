const express = require("express");
const router = express.Router();

const {
  initializePayment,
  verifyPayment
} = require("./payment.controller");

const { protect } = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");

// Landlord
router.post(
  "/initialize",
  protect,
  requireRole("landlord"),
  initializePayment
);

router.get(
  "/verify/:reference",
  protect,
  requireRole("landlord"),
  verifyPayment
);

module.exports = router;