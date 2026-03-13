const User = require("../models/user.model");

// 🔹 Get all addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    res.json(user.addresses);
  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Add new address
exports.addAddress = async (req, res) => {
    try {
      
          console.log("REQ.USER:", req.user);
      console.log("REQ.BODY:", req.body);
    const {
      label,
      fullName,
      phone,
      address,
      city,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Ensure addresses array exists
    if (!user.addresses) {
      user.addresses = [];
    }

    // 🔥 If new address is default, unset old default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      phone,
      address,
      city,
      postalCode,
      country,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    console.error("SET DEFAULT ADDRESS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};