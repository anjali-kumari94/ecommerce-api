const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
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
      required: true,
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
    // Brand identity
    logo: {
      type: String,
    },
    logoDark: {
      type: String,
    },
    logoLight: {
      type: String,
    },
    brandColors: {
      primary: {
        type: String,
        default: "#000000",
      },
      secondary: {
        type: String,
        default: "#ffffff",
      },
      accent: {
        type: String,
      },
    },
    // Brand positioning and messaging
    brandPositioning: {
      mission: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      vision: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      values: [
        {
          type: String,
          trim: true,
          maxlength: 100,
        },
      ],
      tagline: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      uniqueValueProposition: {
        type: String,
        trim: true,
        maxlength: 300,
      },
    },
    // Target audience and market
    targetAudience: {
      demographics: {
        ageRange: {
          min: { type: Number, min: 0 },
          max: { type: Number, min: 0 },
        },
        gender: {
          type: String,
          enum: ["male", "female", "all", "other"],
          default: "all",
        },
        incomeLevel: {
          type: String,
          enum: ["low", "middle", "high", "luxury"],
        },
        location: {
          type: String,
          trim: true,
        },
      },
      psychographics: {
        lifestyle: [
          {
            type: String,
            trim: true,
          },
        ],
        interests: [
          {
            type: String,
            trim: true,
          },
        ],
        values: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    },
    // Brand personality and voice
    brandPersonality: {
      traits: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      tone: {
        type: String,
        enum: [
          "formal",
          "casual",
          "friendly",
          "professional",
          "playful",
          "serious",
        ],
        default: "professional",
      },
      voice: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },
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
    // Social media and contact
    socialMedia: {
      website: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      youtube: {
        type: String,
        trim: true,
      },
    },
    contact: {
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zipCode: { type: String, trim: true },
      },
    },
    // Brand status and visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
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
    followerCount: {
      type: Number,
      default: 0,
    },
    // Brand performance metrics
    performance: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      totalSales: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
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
brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });
brandSchema.index({ isFeatured: 1 });
brandSchema.index({ sortOrder: 1 });
brandSchema.index({ name: "text", description: "text" });
brandSchema.index({ "brandPositioning.values": 1 });

// Pre-save middleware to generate slug if not provided
brandSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Virtual for full contact address
brandSchema.virtual("fullAddress").get(function () {
  if (!this.contact.address) return "";

  const addr = this.contact.address;
  return [addr.street, addr.city, addr.state, addr.country, addr.zipCode]
    .filter(Boolean)
    .join(", ");
});

// Method to update performance metrics
brandSchema.methods.updatePerformance = async function () {
  const Product = mongoose.model("Product");
  const Review = mongoose.model("Review");

  // Get product count
  this.productCount = await Product.countDocuments({
    brand: this._id,
    isActive: true,
  });

  // Get review statistics
  const reviewStats = await Review.aggregate([
    {
      $match: {
        product: {
          $in: await Product.find({ brand: this._id }).distinct("_id"),
        },
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (reviewStats.length > 0) {
    this.performance.averageRating =
      Math.round(reviewStats[0].averageRating * 10) / 10;
    this.performance.totalReviews = reviewStats[0].totalReviews;
  }

  await this.save();
};

// Static method to get top performing brands
brandSchema.statics.getTopPerforming = async function (limit = 10) {
  return await this.find({ isActive: true })
    .sort({ "performance.revenue": -1, "performance.averageRating": -1 })
    .limit(limit);
};

// Static method to search brands
brandSchema.statics.search = async function (query, options = {}) {
  const { limit = 20, skip = 0, sort = { name: 1 } } = options;

  const searchQuery = {
    isActive: true,
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { "brandPositioning.values": { $in: [new RegExp(query, "i")] } },
    ],
  };

  return await this.find(searchQuery).sort(sort).skip(skip).limit(limit);
};

module.exports = mongoose.model("Brand", brandSchema);
