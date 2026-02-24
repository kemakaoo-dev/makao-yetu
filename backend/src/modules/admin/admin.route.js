const express = require("express");
const router = express.Router();

const {
  getAllListings,
  approveListing,
  rejectListing,
  getAllLandlords,
  toggleLandlordStatus,
  getAllPayments
} = require("./admin.controller");

const { protect } = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");

// All routes protected + admin only
router.use(protect, requireRole("admin"));

// Listings moderation
router.get("/listings", getAllListings);
router.put("/listings/:id/approve", approveListing);
router.put("/listings/:id/reject", rejectListing);

// Landlord management
router.get("/landlords", getAllLandlords);
router.put("/landlords/:id/toggle-status", toggleLandlordStatus);

// Payments
router.get("/payments", getAllPayments);

module.exports = router;