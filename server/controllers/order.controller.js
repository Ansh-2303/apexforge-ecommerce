const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Coupon = require("../models/coupon.model");
const mongoose = require("mongoose");
const crypto = require("crypto");

// 🔹 Create Order
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) throw new Error("Product not found");

      const variant = product.variants.id(item.variant);
      if (!variant) throw new Error("Variant not found");

      if (item.quantity > variant.countInStock) {
        throw new Error(
          `Insufficient stock for ${product.name} (${variant.sku})`
        );
      }

      orderItems.push({
        product: product._id,
        variant: variant._id,
        sku: variant.sku,
        name: product.name,
        image: product.images?.[0] || "",
        price: variant.price,
        quantity: item.quantity,
      });
    }

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const taxPrice = itemsPrice * 0.18;
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;

    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
      }).session(session);

      if (!coupon) throw new Error("Invalid coupon");
      if (!coupon.isActive) throw new Error("Coupon inactive");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiry = new Date(coupon.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      if (expiry < today) throw new Error("Coupon expired");
      if (coupon.usedCount >= coupon.usageLimit)
        throw new Error("Coupon usage limit reached");

      discountAmount =
        coupon.discountType === "percentage"
          ? (itemsPrice * coupon.value) / 100
          : coupon.value;

      appliedCoupon = {
        code: coupon.code,
        discountAmount,
      };
    }

    const totalPrice =
      itemsPrice + taxPrice + shippingPrice - discountAmount;

    const order = await Order.create(
      [
        {
          user: req.user._id,
          orderItems,
          shippingAddress,
          paymentMethod: paymentMethod || "COD",
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          coupon: appliedCoupon,
        },
      ],
      { session }
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};



// 🔹 Pay Order
exports.payOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("Order already paid");
    if (order.user.toString() !== req.user._id.toString())
      throw new Error("Not authorized");

    for (const item of order.orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          "variants._id": item.variant,
          "variants.countInStock": { $gte: item.quantity },
        },
        {
          $inc: { "variants.$.countInStock": -item.quantity },
        },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "paid";

    if (order.coupon?.code) {
      const coupon = await Coupon.findOne({ code: order.coupon.code }).session(session);
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save({ session });
      }
    }

    order.paymentResult = {
      id: crypto.randomBytes(8).toString("hex"),
      status: "success",
      update_time: new Date(),
    };

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Payment successful", order });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Update Order Status

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "cancelled" && order.isPaid && order.status !== "cancelled") {
      for (const item of order.orderItems) {
        await Product.updateOne(
          { _id: item.product, "variants._id": item.variant },
          { $inc: { "variants.$.countInStock": item.quantity } }
        );
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Mark Order As Shipped
exports. markOrderAsShipped = async (req, res) => {
  try {
    const { courier, trackingNumber, trackingUrl } = req.body;

    if (!courier || !trackingNumber) {
      return res.status(400).json({
        message: "Courier and tracking number are required",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.isPaid) return res.status(400).json({ message: "Cannot ship unpaid order" });

    let formattedTrackingUrl = trackingUrl || "";

    if (formattedTrackingUrl && !formattedTrackingUrl.startsWith("http")) {
      formattedTrackingUrl = "https://" + formattedTrackingUrl;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        shipment: {
          courier,
          trackingNumber,
          trackingUrl: formattedTrackingUrl,
          shippedAt: new Date(),
          deliveredAt: null,
        },
        status: "shipped",
      },
      { new: true }
    );

    res.json({
      message: "Order marked as shipped",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Mark Order As Delivered
exports.markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "shipped")
      return res.status(400).json({ message: "Only shipped orders can be delivered" });

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        "shipment.deliveredAt": new Date(),
        status: "delivered",
      },
      { new: true }
    );

    res.json({
      message: "Order marked as delivered",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Order By ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Admin Dashboard Stats
exports.getAdminStats = async (req, res) => {
  try {
const totalOrders = await Order.countDocuments({
  status: { $ne: "cancelled" }
});
    const totalRevenueAgg = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const totalProducts = await Product.countDocuments();
   const totalUsers = await User.countDocuments({
  role: "user"
});

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/orderController.js

exports.getSalesAnalytics = async (req, res) => {
  try {

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const sales = await Order.aggregate([
      {
$match: {
  createdAt: { $gte: last7Days },
  isPaid: true,
  status: { $ne: "cancelled" }
}
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderStatusAnalytics = async (req, res) => {
  try {

    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(statusStats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {

const orders = await Order.find({
  status: { $ne: "cancelled" }
})
.populate("user","name email")
.sort({ createdAt: -1 })
.limit(5);

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getRevenueByCategory = async (req, res) => {
  try {

    const data = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          status: { $ne: "cancelled" }
        }
      },
      { $unwind: "$orderItems" },

      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: {
              $multiply: [
                "$orderItems.price",
                "$orderItems.quantity"
              ]
            }
          }
        }
      },

      { $sort: { revenue: -1 } }

    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADMIN CUSTOMER ANALYTICS

exports.getCustomerAnalytics = async (req, res) => {

  try {

const analytics = await Order.aggregate([

  {
    $match: {
      isPaid: true,
      status: { $ne: "cancelled" }
    }
  },

      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 }
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" },

      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          totalSpent: 1,
          totalOrders: 1
        }
      },

      { $sort: { totalSpent: -1 } },

      { $limit: 5 }

    ]);

    res.json(analytics);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};