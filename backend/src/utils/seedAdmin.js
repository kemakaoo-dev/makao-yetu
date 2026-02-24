const bcrypt = require("bcryptjs");
const User = require("../modules/users/user.model");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      subscriptionStatus: "active"
    });

    console.log("Admin account created successfully");
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
  }
};

module.exports = seedAdmin;