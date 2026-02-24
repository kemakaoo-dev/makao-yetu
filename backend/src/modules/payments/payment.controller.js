const crypto = require("crypto");
const Payment = require("./payment.model");
const User = require("../users/user.model");
const paystack = require("../../config/paystack");

// 1️⃣ Initialize Payment
const initializePayment = async (req, res, next) => {
  try {
    const amount = 1000 * 100; // 1000 KES in kobo equivalent

    const reference = crypto.randomBytes(10).toString("hex");

    // Save payment as pending
    await Payment.create({
      landlord: req.user._id,
      amount: 1000,
      reference,
      status: "pending"
    });

    const response = await paystack.post("/transaction/initialize", {
      email: req.user.email,
      amount,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment-success`
    });

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url
    });

  } catch (error) {
    next(error);
  }
};


// 2️⃣ Verify Payment (Manual Verification)
const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);

    if (response.data.data.status !== "success") {
      return next({ statusCode: 400, message: "Payment not successful" });
    }

    const payment = await Payment.findOne({ reference });

    if (!payment) {
      return next({ statusCode: 404, message: "Payment not found" });
    }

    payment.status = "success";
    await payment.save();

    // Activate subscription
    const user = await User.findById(payment.landlord);

    const now = new Date();
    const expiry = new Date(now.setDate(now.getDate() + 30));

    user.subscriptionStatus = "active";
    user.subscriptionExpiresAt = expiry;
    await user.save();

    res.json({
      success: true,
      message: "Subscription activated"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializePayment,
  verifyPayment
};