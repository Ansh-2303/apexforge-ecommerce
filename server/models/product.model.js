const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    slug: {
  type: String,
  required: true,
  unique: true,
},

    description: String,

    brand: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    images: [String], // multiple images

    basePrice: Number,
  
variants: {
  type: [variantSchema],
  validate: [(val) => val.length > 0, "Product must have at least one variant"],
},

    specifications: {
      weight: String,
      material: String,
      dimensions: String,
      warranty: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },
    badge: {
  type: String,
  enum: ["TOP", "PRO", "NEW", "SALE", null],
  default: null
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);