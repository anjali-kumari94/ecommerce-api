const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      parent,
      metaTitle,
      metaDescription,
      keywords,
      image,
      icon,
      categoryDesign,
      isActive,
      isFeatured,
      sortOrder,
      customFields,
    } = req.body;

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Category with this name already exists",
      });
    }

    // If parent is provided, validate it exists and update level
    let level = 0;
    let path = [];

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          error: "Parent category not found",
        });
      }
      level = parentCategory.level + 1;
      path = [...parentCategory.path, parentCategory._id];
    }

    const slugify = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const category = new Category({
      name,
      slug: slugify(name),
      description,
      longDescription,
      parent,
      level,
      path,
      metaTitle,
      metaDescription,
      keywords,
      image,
      icon,
      categoryDesign,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      sortOrder: sortOrder || 0,
      customFields,
    });

    await category.save();

    // Update parent's children array
    if (parent) {
      await Category.findByIdAndUpdate(parent, {
        $push: { children: category._id },
      });
    }

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create category",
    });
  }
};

// @desc    Get all categories with optional filtering
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "name",
      order = "asc",
      search,
      parent,
      isActive,
      isFeatured,
      level,
      includeProducts = false,
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (parent !== undefined) {
      query.parent = parent === "null" ? null : parent;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    if (level !== undefined) {
      query.level = parseInt(level);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const categories = await Category.find(query)
      .populate("parent", "name slug")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Category.countDocuments(query);

    // Include product count if requested
    let categoriesWithProducts = categories;
    if (includeProducts === "true") {
      categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Product.countDocuments({
            category: category._id,
            isActive: true,
          });
          return {
            ...category.toObject(),
            productCount,
          };
        })
      );
    }

    res.json({
      success: true,
      data: categoriesWithProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
};

// @desc    Get category tree structure
// @route   GET /api/v1/categories/tree
// @access  Public
const getCategoryTree = async (req, res) => {
  try {
    const { includeProducts = false } = req.query;

    const tree = await Category.buildTree();

    if (includeProducts === "true") {
      const populateProducts = async (categories) => {
        for (const category of categories) {
          category.productCount = await Product.countDocuments({
            category: category._id,
            isActive: true,
          });

          if (category.children && category.children.length > 0) {
            await populateProducts(category.children);
          }
        }
      };

      await populateProducts(tree);
    }

    res.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    console.error("Error fetching category tree:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category tree",
    });
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeProducts = false, includeChildren = false } = req.query;

    // Check if id is ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let query = {};
    if (isObjectId) {
      query._id = id;
    } else {
      query.slug = id;
    }

    let category = await Category.findOne(query)
      .populate("parent", "name slug")
      .populate("path", "name slug");

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Include children if requested
    if (includeChildren === "true") {
      const children = await Category.find({
        parent: category._id,
        isActive: true,
      }).sort({ sortOrder: 1, name: 1 });
      category = category.toObject();
      category.children = children;
    }

    // Include products if requested
    if (includeProducts === "true") {
      const products = await Product.find({
        category: category._id,
        isActive: true,
      })
        .populate("brand", "name logo")
        .sort({ createdAt: -1 })
        .limit(10);

      category = category.toObject();
      category.products = products;
    }

    // Increment view count
    await Category.findByIdAndUpdate(category._id, {
      $inc: { viewCount: 1 },
    });

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category",
    });
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: "Category with this name already exists",
        });
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("parent", "name slug");

    res.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update category",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${productCount} products. Please reassign or delete products first.`,
      });
    }

    // Check if category has children
    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${childrenCount} subcategories. Please delete or reassign subcategories first.`,
      });
    }

    // Remove from parent's children array
    if (category.parent) {
      await Category.findByIdAndUpdate(category.parent, {
        $pull: { children: category._id },
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete category",
    });
  }
};

// @desc    Get category analytics
// @route   GET /api/v1/categories/:id/analytics
// @access  Private (Admin)
const getCategoryAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Get all descendant categories
    const descendants = await category.getDescendants();
    const allCategoryIds = [category._id, ...descendants.map((d) => d._id)];

    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { category: { $in: allCategoryIds } } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ["$isActive", 1, 0] } },
          averagePrice: { $avg: "$price" },
          totalValue: { $sum: "$price" },
        },
      },
    ]);

    // Get view statistics
    const viewStats = await Category.aggregate([
      { $match: { _id: { $in: allCategoryIds } } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewCount" },
        },
      },
    ]);

    const analytics = {
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        level: category.level,
        viewCount: category.viewCount,
      },
      hierarchy: {
        parent: category.parent,
        childrenCount: descendants.length,
        totalLevels: Math.max(...descendants.map((d) => d.level)) + 1,
      },
      products: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        averagePrice: 0,
        totalValue: 0,
      },
      views: viewStats[0]?.totalViews || 0,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching category analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category analytics",
    });
  }
};

// @desc    Bulk update categories
// @route   PUT /api/v1/categories/bulk
// @access  Private (Admin)
const bulkUpdateCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Categories array is required",
      });
    }

    const results = [];
    const errors = [];

    for (const categoryUpdate of categories) {
      try {
        const { id, ...updateData } = categoryUpdate;

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );

        if (updatedCategory) {
          results.push(updatedCategory);
        } else {
          errors.push({ id, error: "Category not found" });
        }
      } catch (error) {
        errors.push({ id: categoryUpdate.id, error: error.message });
      }
    }

    res.json({
      success: true,
      data: {
        updated: results,
        errors,
      },
      message: `Updated ${results.length} categories${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
    });
  } catch (error) {
    console.error("Error bulk updating categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to bulk update categories",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryTree,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryAnalytics,
  bulkUpdateCategories,
};
