const bcrypt = require("bcryptjs");
const User = require("../users/user.model");
const generateToken = require("../../utils/generateToken");


// Register landlord
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next({ statusCode: 400, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ statusCode: 400, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "landlord"
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      }
    });

  } catch (error) {
    next(error);
  }
};


// Login landlord/admin
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next({ statusCode: 400, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next({ statusCode: 401, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return next({ statusCode: 403, message: "Account disabled" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next({ statusCode: 401, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};