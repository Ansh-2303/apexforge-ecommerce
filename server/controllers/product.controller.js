const Product = require("../models/product.model")
const Order = require("../models/order.model")
const slugify = require("slugify")

/* ---------------- CREATE PRODUCT ---------------- */

exports.createProduct = async (req, res) => {
  try {

    const baseSlug = slugify(req.body.name, { lower: true })
    let slug = baseSlug

    let existingProduct = await Product.findOne({ slug })
    let counter = 1

    while (existingProduct) {
      slug = `${baseSlug}-${counter}`
      existingProduct = await Product.findOne({ slug })
      counter++
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null

    const variants =
      typeof req.body.variants === "string"
        ? JSON.parse(req.body.variants)
        : req.body.variants

const product = await Product.create({
  name: req.body.name,
  slug,
  brand: req.body.brand,
  description: req.body.description,
  category: req.body.category,
  isFeatured: req.body.isFeatured,
  badge: req.body.badge || "",
  images: imagePath ? [imagePath] : [],
  variants,
  specifications: {},
})

    res.status(201).json(product)

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


/* ---------------- GET PRODUCTS (FILTER + PAGINATION + SORT) ---------------- */
exports.getProducts = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const brand = req.query.brand || "";

    const minPrice = req.query.minPrice || "";
    const maxPrice = req.query.maxPrice || "";

    const featured = req.query.featured;
    const sort = req.query.sort || "newest";

    const filter = {};

    /* SEARCH */

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    /* CATEGORY */

    if (category) {
      filter.category = category;
    }

    /* BRAND */

    if (brand) {
      filter.brand = brand;
    }

    /* FEATURED */

    if (featured === "true") {
      filter.isFeatured = true;
    }

    /* PRICE RANGE */

    if (minPrice || maxPrice) {

      filter["variants.price"] = {};

      if (minPrice) {
        filter["variants.price"].$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter["variants.price"].$lte = Number(maxPrice);
      }

    }

    /* SORTING */

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { "variants.price": 1 };
    }

    if (sort === "price_desc") {
      sortOption = { "variants.price": -1 };
    }

    /* COUNT */

    const totalProducts = await Product.countDocuments(filter);

    /* QUERY */

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    /* DYNAMIC BRANDS */

    const brands = await Product.distinct("brand");

    res.json({
      products,
      brands,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit)
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

/* ---------------- GET PRODUCT BY ID ---------------- */

exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("category", "name")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/* ---------------- GET PRODUCT BY SLUG ---------------- */

exports.getProductBySlug = async (req, res) => {
  try {

    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/* ---------------- UPDATE PRODUCT ---------------- */

exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    /* BASIC INFO */

    product.name = req.body.name || product.name
    product.slug = req.body.slug || product.slug
    product.brand = req.body.brand || product.brand
    product.description = req.body.description || product.description
    product.category = req.body.category || product.category

    /* FEATURED */

    product.isFeatured =
      req.body.isFeatured !== undefined
        ? req.body.isFeatured
        : product.isFeatured

    /* BADGE */

    product.badge = req.body.badge || ""

    /* VARIANTS */

    if (req.body.variants) {
      product.variants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants
    }

    const updatedProduct = await product.save()

    res.json(updatedProduct)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/* ---------------- DELETE PRODUCT ---------------- */

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    await product.deleteOne()

    res.json({ message: "Product deleted" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/* ---------------- PRODUCT PERFORMANCE ANALYTICS ---------------- */

exports.getProductPerformance = async (req, res) => {
  try {

    const analytics = await Order.aggregate([

      { $unwind: "$orderItems" },

      {
        $group: {
          _id: "$orderItems.product",
          unitsSold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$orderItems.price", "$orderItems.quantity"]
            }
          }
        }
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          unitsSold: 1,
          revenue: 1,
          variants: "$product.variants"
        }
      },

      { $sort: { unitsSold: -1 } },

      { $limit: 10 }

    ])

    res.json(analytics)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/* ---------------- INVENTORY ANALYTICS ---------------- */

exports.getInventoryAnalytics = async (req, res) => {
  try {

    const products = await Product.find({}, "name variants")

    let totalStock = 0
    let lowStock = []
    let outOfStock = []

    products.forEach(product => {

      product.variants.forEach(variant => {

        totalStock += variant.countInStock

        if (variant.countInStock === 0) {
          outOfStock.push({
            product: product.name,
            sku: variant.sku,
            stock: variant.countInStock
          })
        }

        if (variant.countInStock > 0 && variant.countInStock <= 5) {
          lowStock.push({
            product: product.name,
            sku: variant.sku,
            stock: variant.countInStock
          })
        }

      })

    })

    res.json({
      totalStock,
      lowStock,
      outOfStock
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.createProductReview = async (req, res) => {

  try {

    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" })
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()

    res.status(201).json({ message: "Review added" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}