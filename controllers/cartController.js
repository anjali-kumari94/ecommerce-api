const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
exports.addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product)
    return res.status(404).json({ success: false, error: "Product not found" });

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ success: true, data: cart });
};

// Get user's cart
exports.getCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) return res.json({ success: true, data: { items: [], total: 0 } });

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  res.json({ success: true, data: { items: cart.items, total } });
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    return res.status(404).json({ success: false, error: "Cart not found" });

  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );
  if (itemIndex === -1)
    return res
      .status(404)
      .json({ success: false, error: "Item not found in cart" });

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ success: true, data: cart });
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    return res.status(404).json({ success: false, error: "Cart not found" });

  cart.items = cart.items.filter((item) => !item.product.equals(productId));
  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ success: true, data: cart });
};

// Clear cart
exports.clearCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    return res.status(404).json({ success: false, error: "Cart not found" });

  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ success: true, message: "Cart cleared" });
};
