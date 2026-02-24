const Listing = require("../listings/listing.model");
const User = require("../users/user.model");
const Payment = require("../payments/payment.model");


// 1️⃣ Get All Listings (Admin)
const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find()
      .populate("landlord", "name email subscriptionStatus")
      .sort({ createdAt: -1 });

    res.json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};


// 2️⃣ Approve Listing
const approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!listing) {
      return next({ statusCode: 404, message: "Listing not found" });
    }

    res.json({
      success: true,
      message: "Listing approved",
      listing
    });

  } catch (error) {
    next(error);
  }
};


// 3️⃣ Reject Listing
const rejectListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!listing) {
      return next({ statusCode: 404, message: "Listing not found" });
    }

    res.json({
      success: true,
      message: "Listing rejected",
      listing
    });

  } catch (error) {
    next(error);
  }
};


// 4️⃣ Get All Landlords
const getAllLandlords = async (req, res, next) => {
  try {
    const landlords = await User.find({ role: "landlord" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, landlords });
  } catch (error) {
    next(error);
  }
};


// 5️⃣ Ban / Unban Landlord
const toggleLandlordStatus = async (req, res, next) => {
  try {
    const landlord = await User.findById(req.params.id);

    if (!landlord || landlord.role !== "landlord") {
      return next({ statusCode: 404, message: "Landlord not found" });
    }

    landlord.isActive = !landlord.isActive;
    await landlord.save();

    res.json({
      success: true,
      message: `Landlord ${
        landlord.isActive ? "activated" : "banned"
      } successfully`
    });

  } catch (error) {
    next(error);
  }
};


// 6️⃣ View All Payments
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("landlord", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllListings,
  approveListing,
  rejectListing,
  getAllLandlords,
  toggleLandlordStatus,
  getAllPayments
};