const User = require("../models/user.model")

exports.toggleWishlist = async (req, res) => {

  try {

    const user = await User.findById(req.user._id)

    const productId = req.params.productId

    const exists = user.wishlist.includes(productId)

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      )
    } else {
      user.wishlist.push(productId)
    }

    await user.save()

    res.json(user.wishlist)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}


exports.getWishlist = async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .populate("wishlist")

    res.json(user.wishlist)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}