const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/user.model");


dotenv.config({ path: "../.env" });
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin Created Successfully ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();