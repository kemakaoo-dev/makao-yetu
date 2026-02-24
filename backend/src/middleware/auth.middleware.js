const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next({ statusCode: 401, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next({ statusCode: 401, message: "User not found" });
    }

    if (!user.isActive) {
      return next({ statusCode: 403, message: "Account disabled" });
    }

    req.user = user;
    next();
  } catch (error) {
    next({ statusCode: 401, message: "Invalid token" });
  }
};

module.exports = { protect };