const Listing = require("./listing.model");

// 1️⃣ Public - Get Approved Listings


const getPublicListings = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice, bedrooms } = req.query;

    const filter = {
      status: "approved",
      isActive: true
    };

    if (location) filter.location = location;
    if (bedrooms) filter.bedrooms = bedrooms;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};

// 2️⃣ Public - Get Single Listing
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      status: "approved",
      isActive: true
    }).populate("landlord", "name email");

    if (!listing) {
      return next({ statusCode: 404, message: "Listing not found" });
    }

    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};


// 3️⃣ Landlord - Create Listing
const createListing = async (req, res, next) => {
    try {
      // Subscription check
      if (req.user.subscriptionStatus !== "active") {
        return next({
          statusCode: 403,
          message: "Subscription required"
        });
      }
  
      if (req.user.subscriptionExpiresAt < new Date()) {
        req.user.subscriptionStatus = "expired";
        await req.user.save();
  
        return next({
          statusCode: 403,
          message: "Subscription expired"
        });
      }
  
      const imageUrls = req.files?.map(file => file.path) || [];
  
      const listing = await Listing.create({
        ...req.body,
        images: imageUrls,
        landlord: req.user._id
      });
  
      res.status(201).json({
        success: true,
        message: "Listing created and pending approval",
        listing
      });
  
    } catch (error) {
      next(error);
    }
  };


  // 4️⃣ Landlord - Get My Listings
const getMyListings = async (req, res, next) => {
    try {
        const listings = await Listing.find({ landlord: req.user._id }).sort({ createdAt: -1 });
    
        res.json({ success: true, listings });
    } catch (error) {
        next(error);
    }
    };



// 5️⃣ Landlord - Update Listing
const updateListing = async (req, res, next) => {
    const imageUrls = req.files?.map(file => file.path);

        if (imageUrls && imageUrls.length > 0) {
        req.body.images = imageUrls;
        };
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      req.body,
      { new: true }
    );

    if (!listing) {
      return next({ statusCode: 404, message: "Listing not found" });
    }

    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// 6️⃣ Landlord - Delete (Soft Delete)
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!listing) {
      return next({ statusCode: 404, message: "Listing not found" });
    }

    res.json({ success: true, message: "Listing deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicListings,
  getListingById,
  createListing,
  getMyListings,
  updateListing,
  deleteListing
};