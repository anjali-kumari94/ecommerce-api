const Shipping = require("../models/Shipping");

// Admin: Create a new shipping method
exports.createShippingMethod = async (req, res) => {
  try {
    const shipping = new Shipping(req.body);
    await shipping.save();
    res.status(201).json(shipping);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Update a shipping method
exports.updateShippingMethod = async (req, res) => {
  try {
    const shipping = await Shipping.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!shipping)
      return res.status(404).json({ error: "Shipping method not found" });
    res.json(shipping);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Delete a shipping method
exports.deleteShippingMethod = async (req, res) => {
  try {
    const shipping = await Shipping.findByIdAndDelete(req.params.id);
    if (!shipping)
      return res.status(404).json({ error: "Shipping method not found" });
    res.json({ message: "Shipping method deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Public: List all active shipping methods
exports.getShippingMethods = async (req, res) => {
  try {
    const methods = await Shipping.find({ isActive: true });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Calculate shipping cost (helper)
exports.calculateShippingCost = async (methodId, weight, region) => {
  const method = await Shipping.findById(methodId);
  if (!method || !method.isActive) throw new Error("Invalid shipping method");
  let cost = method.baseRate + method.ratePerKg * weight;
  if (region && method.regions && method.regions.length > 0) {
    const regionObj = method.regions.find((r) => r.region === region);
    if (regionObj) cost += regionObj.extraCost;
  }
  return {
    cost,
    estimatedDeliveryDays: method.estimatedDeliveryDays,
    name: method.name,
  };
};
