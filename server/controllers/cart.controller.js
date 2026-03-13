const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// 🔹 Add To Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;

    if (!productId || !variantId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    if (quantity > variant.countInStock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (newQty > variant.countInStock) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      existingItem.quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,
        sku: variant.sku,
        price: variant.price,
        quantity,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

 const formattedItems = populatedCart.items.map((item) => {

  const variant = item.product.variants.id(item.variant);

  return {
    ...item.toObject(),
    variantDetails: variant
      ? {
          price: variant.price,
          stock: variant.countInStock,
        }
      : null,
  };

});

res.json({
  ...populatedCart.toObject(),
  items: formattedItems,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔹// 🔹 Get Cart
exports.getCart = async (req, res, next) => {
  try {

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map((item) => {

      const variant = item.product.variants.id(item.variant);

      return {
        ...item.toObject(),
        variantDetails: variant
          ? {
              price: variant.price,
              stock: variant.countInStock,
            }
          : null,
      };

    });

    res.json({
      ...cart.toObject(),
      items: formattedItems,
    });

  } catch (error) {
    next(error);
  }
};
// 🔹 Update Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(productId);
    const variant = product.variants.id(variantId);

    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (quantity > variant.countInStock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    item.quantity = quantity;

    await cart.save();

    const populatedCart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

   const formattedItems = populatedCart.items.map((item) => {

  const variant = item.product.variants.id(item.variant);

  return {
    ...item.toObject(),
    variantDetails: variant
      ? {
          price: variant.price,
          stock: variant.countInStock,
        }
      : null,
  };

});

res.json({
  ...populatedCart.toObject(),
  items: formattedItems,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Remove Item
exports.removeCartItem = async (req, res) => {
  try {
    const { productId, variantId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant.toString() === variantId
        )
    );

    await cart.save();

    const populatedCart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

 const formattedItems = populatedCart.items.map((item) => {

  const variant = item.product.variants.id(item.variant);

  return {
    ...item.toObject(),
    variantDetails: variant
      ? {
          price: variant.price,
          stock: variant.countInStock,
        }
      : null,
  };

});

res.json({
  ...populatedCart.toObject(),
  items: formattedItems,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};