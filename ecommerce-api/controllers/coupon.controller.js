const Coupon = require("../models/coupon.model");

// 🔹 Admin create coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, value, expiryDate, usageLimit } = req.body;

    const coupon = await Coupon.create({
      code,
      discountType,
      value,
      expiryDate,
      usageLimit,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Validate coupon (user side)
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon inactive" });
    }

  const today = new Date();
today.setHours(0, 0, 0, 0);

const expiry = new Date(coupon.expiryDate);
expiry.setHours(0, 0, 0, 0);

if (expiry < today) {
  return res.status(400).json({ message: "Coupon expired" });
}

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all coupons (Admin)
exports.getAllCoupons = async (req, res) => {

try{

const {search="",sort="newest"} = req.query;

let filter = {
code:{ $regex: search, $options:"i" }
};

let sortOption = { createdAt:-1 };

if(sort==="expiry") sortOption = { expiryDate:1 };
if(sort==="usage") sortOption = { usedCount:-1 };

const coupons = await Coupon.find(filter).sort(sortOption);

res.json(coupons);

}catch(error){

res.status(500).json({message:error.message});

}

};


// 🔹 Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleCoupon = async (req,res)=>{

try{

const coupon = await Coupon.findById(req.params.id);

coupon.isActive = !coupon.isActive;

await coupon.save();

res.json(coupon);

}catch(err){

res.status(500).json({message:err.message});

}

};