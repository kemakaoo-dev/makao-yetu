const Inquiry = require("./inquiry.model");
const Listing = require("../listings/listing.model");
const sendEmail = require("../../utils/sendEmail");

// 1️⃣ Public - Send Inquiry
const createInquiry = async (req, res, next) => {
  try {
    const { listingId, tenantName, tenantEmail, message } = req.body;

    if (!listingId || !tenantName || !tenantEmail || !message) {
      return next({ statusCode: 400, message: "All fields are required" });
    }

    const listing = await Listing.findOne({
      _id: listingId,
      status: "approved",
      isActive: true
    }).populate("landlord");

    if (!listing) {
      return next({ statusCode: 404, message: "Listing not found" });
    }

    const inquiry = await Inquiry.create({
      listing: listing._id,
      landlord: listing.landlord._id,
      tenantName,
      tenantEmail,
      tenantPhone,
      message
    });

    // Send email to landlord
    await sendEmail({
      to: listing.landlord.email,
      subject: "New Inquiry on MakaoLink",
      html: `
        <h3>New Inquiry for: ${listing.title}</h3>
        <p><strong>Name:</strong> ${tenantName}</p>
        <p><strong>Email:</strong> ${tenantEmail}</p>
        <p>strong>Phone:</strong> ${tenantPhone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully"
    });

  } catch (error) {
    next(error);
  }
};


// 2️⃣ Landlord - Get My Inquiries
const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      landlord: req.user._id
    })
      .populate("listing", "title location")
      .sort({ createdAt: -1 });

    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getMyInquiries
};