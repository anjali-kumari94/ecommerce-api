const Brand = require("../models/Brand");
const Product = require("../models/Product");
const Review = require("../models/Review");
const slugify = require("slugify");

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private (Admin)
const createBrand = async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      logo,
      logoDark,
      logoLight,
      brandColors,
      brandPositioning,
      targetAudience,
      brandPersonality,
      metaTitle,
      metaDescription,
      keywords,
      socialMedia,
      contact,
      isActive,
      isFeatured,
      isVerified,
      sortOrder,
      customFields,
    } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    // Check if brand with same name already exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        error: "Brand with this name already exists",
      });
    }

    const brand = new Brand({
      name,
      slug,
      description,
      longDescription,
      logo,
      logoDark,
      logoLight,
      brandColors,
      brandPositioning,
      targetAudience,
      brandPersonality,
      metaTitle,
      metaDescription,
      keywords,
      socialMedia,
      contact,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isVerified: isVerified !== undefined ? isVerified : false,
      sortOrder: sortOrder || 0,
      customFields,
    });

    await brand.save();

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create brand",
    });
  }
};

// @desc    Get all brands with optional filtering
// @route   GET /api/v1/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "name",
      order = "asc",
      search,
      isActive,
      isFeatured,
      isVerified,
      includeProducts = false,
      includeStats = false,
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "brandPositioning.values": { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === "true";
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const brands = await Brand.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Brand.countDocuments(query);

    // Include additional data if requested
    let brandsWithData = brands;
    if (includeProducts === "true" || includeStats === "true") {
      brandsWithData = await Promise.all(
        brands.map(async (brand) => {
          const brandData = brand.toObject();

          if (includeProducts === "true") {
            const products = await Product.find({
              brand: brand._id,
              isActive: true,
            })
              .select("name price images")
              .sort({ createdAt: -1 })
              .limit(5);
            brandData.products = products;
          }

          if (includeStats === "true") {
            await brand.updatePerformance();
            brandData.performance = brand.performance;
            brandData.productCount = brand.productCount;
          }

          return brandData;
        })
      );
    }

    res.json({
      success: true,
      data: brandsWithData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch brands",
    });
  }
};

// @desc    Get single brand by ID or slug
// @route   GET /api/v1/brands/:id
// @access  Public
const getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeProducts = false, includeReviews = false } = req.query;

    // Check if id is ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let query = {};
    if (isObjectId) {
      query._id = id;
    } else {
      query.slug = id;
    }

    let brand = await Brand.findOne(query);

    if (!brand) {
      return res.status(404).json({
        success: false,
        error: "Brand not found",
      });
    }

    // Include products if requested
    if (includeProducts === "true") {
      const products = await Product.find({
        brand: brand._id,
        isActive: true,
      })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

      brand = brand.toObject();
      brand.products = products;
    }

    // Include reviews if requested
    if (includeReviews === "true") {
      const productIds = await Product.find({ brand: brand._id }).distinct(
        "_id"
      );
      const reviews = await Review.find({ product: { $in: productIds } })
        .populate("user", "name avatar")
        .populate("product", "name images")
        .sort({ createdAt: -1 })
        .limit(10);

      brand = brand.toObject();
      brand.reviews = reviews;
    }

    // Increment view count
    await Brand.findByIdAndUpdate(brand._id, {
      $inc: { viewCount: 1 },
    });

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch brand",
    });
  }
};

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Private (Admin)
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: "Brand not found",
      });
    }

    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== brand.name) {
      const existingBrand = await Brand.findOne({
        name: updateData.name,
        _id: { $ne: id },
      });
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          error: "Brand with this name already exists",
        });
      }
    }

    // Update the brand
    const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update brand",
    });
  }
};

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private (Admin)
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: "Brand not found",
      });
    }

    // Check if brand has products
    const productCount = await Product.countDocuments({ brand: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete brand with ${productCount} products. Please reassign or delete products first.`,
      });
    }

    await Brand.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete brand",
    });
  }
};

// @desc    Get brand analytics
// @route   GET /api/v1/brands/:id/analytics
// @access  Private (Admin)
const getBrandAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: "Brand not found",
      });
    }

    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { brand: brand._id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ["$isActive", 1, 0] } },
          averagePrice: { $avg: "$price" },
          totalValue: { $sum: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    // Get review statistics
    const productIds = await Product.find({ brand: brand._id }).distinct("_id");
    const reviewStats = await Review.aggregate([
      { $match: { product: { $in: productIds } } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    // Calculate rating distribution
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (reviewStats[0]?.ratingDistribution) {
      reviewStats[0].ratingDistribution.forEach((rating) => {
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      });
    }

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { brand: brand._id } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          categoryName: "$category.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const analytics = {
      brand: {
        id: brand._id,
        name: brand.name,
        slug: brand.slug,
        viewCount: brand.viewCount,
        followerCount: brand.followerCount,
      },
      products: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        averagePrice: 0,
        totalValue: 0,
        minPrice: 0,
        maxPrice: 0,
      },
      reviews: {
        totalReviews: reviewStats[0]?.totalReviews || 0,
        averageRating: reviewStats[0]?.averageRating || 0,
        ratingDistribution,
      },
      categories: categoryStats,
      performance: brand.performance,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching brand analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch brand analytics",
    });
  }
};

// @desc    Get top performing brands
// @route   GET /api/v1/brands/top-performing
// @access  Public
const getTopPerformingBrands = async (req, res) => {
  try {
    const { limit = 10, sortBy = "revenue" } = req.query;

    let sortField = "performance.revenue";
    if (sortBy === "rating") {
      sortField = "performance.averageRating";
    } else if (sortBy === "products") {
      sortField = "productCount";
    } else if (sortBy === "views") {
      sortField = "viewCount";
    }

    const brands = await Brand.getTopPerforming(parseInt(limit));

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching top performing brands:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch top performing brands",
    });
  }
};

// @desc    Search brands
// @route   GET /api/v1/brands/search
// @access  Public
const searchBrands = async (req, res) => {
  try {
    const { q, limit = 20, skip = 0, sort = { name: 1 } } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const brands = await Brand.search(q, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      sort,
    });

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("Error searching brands:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search brands",
    });
  }
};

// @desc    Bulk update brands
// @route   PUT /api/v1/brands/bulk/update
// @access  Private (Admin)
const bulkUpdateBrands = async (req, res) => {
  try {
    const { brands } = req.body;

    if (!Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Brands array is required",
      });
    }

    const results = [];
    const errors = [];

    for (const brandUpdate of brands) {
      try {
        const { id, ...updateData } = brandUpdate;

        const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });

        if (updatedBrand) {
          results.push(updatedBrand);
        } else {
          errors.push({ id, error: "Brand not found" });
        }
      } catch (error) {
        errors.push({ id: brandUpdate.id, error: error.message });
      }
    }

    res.json({
      success: true,
      data: {
        updated: results,
        errors,
      },
      message: `Updated ${results.length} brands${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
    });
  } catch (error) {
    console.error("Error bulk updating brands:", error);
    res.status(500).json({
      success: false,
      error: "Failed to bulk update brands",
    });
  }
};

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  getBrandAnalytics,
  getTopPerformingBrands,
  searchBrands,
  bulkUpdateBrands,
};
