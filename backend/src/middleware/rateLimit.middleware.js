const rateLimit = require("express-rate-limit");

const inquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many inquiries. Try again later."
});

module.exports = { inquiryLimiter };