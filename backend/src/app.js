const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./modules/auth/auth.route");
const userRoutes = require("./modules/users/user.route");
const listingRoutes = require("./modules/listings/listing.route");
const inquiryRoutes = require("./modules/inquiries/inquiry.route");
const paymentRoutes = require("./modules/payments/payment.route");
const adminRoutes = require("./modules/admin/admin.route");

const app = express();

// Security
app.use(helmet());

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "MakaoLink API running..." });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;