const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");

// Landlord-only route
router.get("/dashboard", protect, requireRole("landlord"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome landlord dashboard",
    user: req.user
  });
});

// Admin-only route
router.get("/admin-test", protect, requireRole("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome admin"
  });
});

module.exports = router;