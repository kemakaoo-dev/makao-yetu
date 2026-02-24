const express = require("express");
const router = express.Router();

const {
  getPublicListings,
  getListingById,
  createListing,
  getMyListings,
  updateListing,
  deleteListing
} = require("./listing.controller");

const { protect } = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");
const upload = require("../../middleware/upload.middleware");

// Public
router.get("/", getPublicListings);
router.get("/:id", getListingById);

// Landlord
router.post(
    "/",
    protect,
    requireRole("landlord"),
    upload.array("images", 5),
    createListing
  );
router.get("/landlord/my", protect, requireRole("landlord"), getMyListings);
router.put(
    "/:id",
    protect,
    requireRole("landlord"),
    upload.array("images", 5),
    updateListing
  );
router.delete("/:id", protect, requireRole("landlord"), deleteListing);

module.exports = router;