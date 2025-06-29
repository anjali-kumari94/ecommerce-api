const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }
    const exists = wishlist.items.some((item) =>
      item.product.equals(productId)
    );
    if (exists)
      return res
        .status(400)
        .json({ success: false, error: "Product already in wishlist" });
    wishlist.items.push({ product: productId });
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    res.json({ success: true, data: wishlist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!wishlist) return res.json({ success: true, data: { items: [] } });
    res.json({ success: true, data: { items: wishlist.items } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist)
      return res
        .status(404)
        .json({ success: false, error: "Wishlist not found" });
    wishlist.items = wishlist.items.filter(
      (item) => !item.product.equals(productId)
    );
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    res.json({ success: true, data: wishlist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Move product from wishlist to cart
exports.moveToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist)
      return res
        .status(404)
        .json({ success: false, error: "Wishlist not found" });
    const itemIndex = wishlist.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (itemIndex === -1)
      return res
        .status(404)
        .json({ success: false, error: "Product not in wishlist" });
    // Remove from wishlist
    wishlist.items.splice(itemIndex, 1);
    wishlist.updatedAt = Date.now();
    await wishlist.save();
    // Add to cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });
    const cartItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (cartItemIndex > -1) {
      cart.items[cartItemIndex].quantity += 1;
    } else {
      const product = await Product.findById(productId);
      if (!product)
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      cart.items.push({
        product: productId,
        quantity: 1,
        price: product.price,
      });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ success: true, message: "Moved to cart", wishlist, cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
