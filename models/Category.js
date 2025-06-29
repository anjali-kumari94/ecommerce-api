const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    longDescription: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    // Category hierarchy
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    level: {
      type: Number,
      default: 0,
      min: 0,
    },
    path: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    // SEO and metadata
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    // Visual elements
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    // Category design specific fields
    categoryDesign: {
      pointOfView: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      valueProposition: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      targetAudience: {
        type: String,
        trim: true,
        maxlength: 200,
      },
      competitiveAdvantage: {
        type: String,
        trim: true,
        maxlength: 300,
      },
    },
    // Status and visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    // Analytics and tracking
    viewCount: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    // Custom fields for flexibility
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ name: "text", description: "text" });

// Virtual for full path name
categorySchema.virtual("fullPath").get(function () {
  return this.path.map((p) => p.name).join(" > ");
});

// Pre-save middleware to generate slug if not provided
categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Method to get all descendants
categorySchema.methods.getDescendants = async function () {
  const descendants = [];
  const queue = [this._id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await this.constructor.find({ parent: currentId });

    for (const child of children) {
      descendants.push(child);
      queue.push(child._id);
    }
  }

  return descendants;
};

// Method to get all ancestors
categorySchema.methods.getAncestors = async function () {
  const ancestors = [];
  let current = this;

  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      ancestors.unshift(current);
    }
  }

  return ancestors;
};

// Static method to build category tree
categorySchema.statics.buildTree = async function () {
  const categories = await this.find({ isActive: true }).sort({ sortOrder: 1 });
  const categoryMap = new Map();
  const rootCategories = [];

  // Create a map of all categories
  categories.forEach((category) => {
    categoryMap.set(category._id.toString(), {
      ...category.toObject(),
      children: [],
    });
  });

  // Build the tree structure
  categories.forEach((category) => {
    const categoryObj = categoryMap.get(category._id.toString());

    if (category.parent) {
      const parent = categoryMap.get(category.parent.toString());
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });

  return rootCategories;
};

module.exports = mongoose.model("Category", categorySchema);
