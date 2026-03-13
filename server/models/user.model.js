const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // Home, Office
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },

    addresses: {
      type: [
        {
          label: String,
          fullName: String,
          phone: String,
          address: String,
          city: String,
          postalCode: String,
          country: String,
          isDefault: Boolean,
        },
      ],
      default: [],   // 🔥 VERY IMPORTANT
    },

    wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }
],
  },
  { timestamps: true }
);
// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);