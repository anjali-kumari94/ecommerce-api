const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    baseRate: {
      type: Number,
      required: true,
      default: 0,
    },
    ratePerKg: {
      type: Number,
      required: true,
      default: 0,
    },
    regions: [
      {
        region: { type: String, required: true },
        extraCost: { type: Number, default: 0 },
      },
    ],
    estimatedDeliveryDays: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", shippingSchema);
