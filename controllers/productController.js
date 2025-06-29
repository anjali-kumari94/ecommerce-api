const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// Helper: upload buffer to Cloudinary
async function uploadToCloudinary(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", folder: "products", public_id: filename },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(fileBuffer);
  });
}

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      // Upload each image to Cloudinary
      images = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer, file.originalname)
        )
      );
    }
    const productData = { ...req.body, images };
    const product = await Product.create(productData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category brand");
    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category brand"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    let images;
    if (req.files && req.files.length > 0) {
      // Upload new images to Cloudinary
      images = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer, file.originalname)
        )
      );
    }
    const updateData = { ...req.body };
    if (images) updateData.images = images;
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
