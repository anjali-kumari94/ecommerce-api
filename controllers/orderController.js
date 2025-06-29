const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { processPayment } = require("./paymentController");
const { calculateShippingCost } = require("./shippingController");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingMethodId,
      shippingAddress,
      region,
      weight,
      paymentMethod,
    } = req.body;
    const user = req.user._id;

    // Calculate shipping cost and estimated delivery
    const shippingData = await calculateShippingCost(
      shippingMethodId,
      weight,
      region
    );
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + shippingData.estimatedDeliveryDays
    );

    // Calculate items total
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = itemsTotal + shippingData.cost;

    // Create order with pending payment status
    const order = new Order({
      user,
      items,
      shippingMethod: {
        id: shippingMethodId,
        name: shippingData.name,
        cost: shippingData.cost,
        estimatedDeliveryDate,
      },
      shippingAddress,
      totalAmount,
      paymentStatus: "pending",
    });
    await order.save();

    // Process payment
    const paymentResult = await processPayment({
      user,
      orderId: order._id,
      amount: totalAmount,
      method: paymentMethod || "stripe",
    });

    // Save payment record
    const payment = new Payment({
      order: order._id,
      user,
      amount: totalAmount,
      status: paymentResult.status,
      method: paymentMethod || "stripe",
      transactionId: paymentResult.transactionId,
      error: paymentResult.error,
    });
    await payment.save();

    // Update order payment status
    order.paymentStatus = payment.status;
    await order.save();

    res.status(201).json({ order, payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
