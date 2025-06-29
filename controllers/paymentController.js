const Payment = require("../models/Payment");
// Uncomment and configure the following for real Stripe integration:
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Process payment for an order (mock or Stripe)
 * @param {Object} params - { user, orderId, amount, method }
 * @returns {Promise<{status: string, transactionId?: string, error?: string}>}
 */
exports.processPayment = async ({
  user,
  orderId,
  amount,
  method = "stripe",
}) => {
  try {
    // For real Stripe integration, use the Stripe API here
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Stripe expects cents
    //   currency: "usd",
    //   metadata: { orderId },
    // });
    // return { status: "completed", transactionId: paymentIntent.id };

    // Mock payment processing
    const transactionId = `mock_txn_${Date.now()}`;
    return { status: "completed", transactionId };
  } catch (error) {
    return { status: "failed", error: error.message };
  }
};

// Get all payments (transactions)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user order");
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
