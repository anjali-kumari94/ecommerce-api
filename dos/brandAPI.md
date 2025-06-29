# Brand API Documentation

## Base URL

```
http://localhost:5001/api/v1/brands
```

## Authentication

- **Public endpoints**: No authentication required
- **Protected endpoints**: Require JWT token with admin role

## Endpoints

### 1. Get All Brands

**GET** `/brands`

Retrieve all brands with optional filtering and pagination.

**Query Parameters:**

- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 20) - Number of items per page
- `sort` (string, default: "name") - Field to sort by
- `order` (string, default: "asc") - Sort order ("asc" or "desc")
- `search` (string) - Search term for name or description
- `category` (string) - Filter by category ID
- `isActive` (boolean) - Filter by active status
- `isFeatured` (boolean) - Filter by featured status
- `isVerified` (boolean) - Filter by verification status
- `country` (string) - Filter by country
- `includeProducts` (boolean) - Include product count for each brand
- `includeReviews` (boolean) - Include review statistics

**Example Request:**

```bash
GET /api/v1/brands?page=1&limit=10&search=apple&isActive=true&includeProducts=true
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "brand_id",
      "name": "Brand Name",
      "slug": "brand-slug",
      "description": "Brand description",
      "longDescription": "Detailed brand description",
      "logo": "logo_url",
      "banner": "banner_url",
      "website": "https://brand-website.com",
      "email": "contact@brand.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Brand Street",
        "city": "Brand City",
        "state": "Brand State",
        "country": "Brand Country",
        "zipCode": "12345"
      },
      "socialMedia": {
        "facebook": "facebook_url",
        "twitter": "twitter_url",
        "instagram": "instagram_url",
        "linkedin": "linkedin_url",
        "youtube": "youtube_url"
      },
      "brandIdentity": {
        "mission": "Brand mission statement",
        "vision": "Brand vision statement",
        "values": ["Value 1", "Value 2", "Value 3"],
        "tagline": "Brand tagline",
        "story": "Brand story and history"
      },
      "brandPositioning": {
        "targetAudience": "Target audience description",
        "uniqueValueProposition": "What makes this brand unique",
        "competitiveAdvantage": "Competitive advantages",
        "marketPosition": "Market positioning statement"
      },
      "categories": ["category_id_1", "category_id_2"],
      "metaTitle": "SEO title",
      "metaDescription": "SEO description",
      "keywords": ["keyword1", "keyword2"],
      "isActive": true,
      "isFeatured": false,
      "isVerified": true,
      "sortOrder": 1,
      "viewCount": 0,
      "productCount": 0,
      "averageRating": 0,
      "totalReviews": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. Get Single Brand

**GET** `/brands/:id`

Retrieve a single brand by ID or slug.

**Path Parameters:**

- `id` (string) - Brand ID or slug

**Query Parameters:**

- `includeProducts` (boolean) - Include products in response
- `includeReviews` (boolean) - Include recent reviews
- `includeCategories` (boolean) - Include category details

**Example Request:**

```bash
GET /api/v1/brands/apple?includeProducts=true&includeReviews=true
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "_id": "brand_id",
    "name": "Brand Name",
    "slug": "brand-slug",
    "description": "Brand description",
    "logo": "logo_url",
    "banner": "banner_url",
    "website": "https://brand-website.com",
    "brandIdentity": {
      "mission": "Brand mission statement",
      "vision": "Brand vision statement",
      "values": ["Value 1", "Value 2"],
      "tagline": "Brand tagline"
    },
    "brandPositioning": {
      "targetAudience": "Target audience description",
      "uniqueValueProposition": "What makes this brand unique"
    },
    "categories": [
      {
        "_id": "category_id",
        "name": "Category Name",
        "slug": "category-slug"
      }
    ],
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "image": "product_image_url",
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "_id": "review_id",
        "rating": 5,
        "comment": "Great product!",
        "user": {
          "_id": "user_id",
          "name": "User Name"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "statistics": {
      "totalProducts": 0,
      "averageRating": 0,
      "totalReviews": 0,
      "viewCount": 0
    }
  }
}
```

### 3. Create Brand

**POST** `/brands`

Create a new brand (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "Brand Name",
  "description": "Short description",
  "longDescription": "Detailed description",
  "logo": "logo_url",
  "banner": "banner_url",
  "website": "https://brand-website.com",
  "email": "contact@brand.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Brand Street",
    "city": "Brand City",
    "state": "Brand State",
    "country": "Brand Country",
    "zipCode": "12345"
  },
  "socialMedia": {
    "facebook": "facebook_url",
    "twitter": "twitter_url",
    "instagram": "instagram_url"
  },
  "brandIdentity": {
    "mission": "Brand mission statement",
    "vision": "Brand vision statement",
    "values": ["Value 1", "Value 2"],
    "tagline": "Brand tagline",
    "story": "Brand story and history"
  },
  "brandPositioning": {
    "targetAudience": "Target audience description",
    "uniqueValueProposition": "What makes this brand unique",
    "competitiveAdvantage": "Competitive advantages",
    "marketPosition": "Market positioning statement"
  },
  "categories": ["category_id_1", "category_id_2"],
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": ["keyword1", "keyword2"],
  "isActive": true,
  "isFeatured": false,
  "isVerified": true,
  "sortOrder": 1
}
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "_id": "brand_id",
    "name": "Brand Name",
    "slug": "brand-slug",
    "description": "Short description",
    "logo": "logo_url",
    "website": "https://brand-website.com",
    "brandIdentity": {
      "mission": "Brand mission statement",
      "vision": "Brand vision statement",
      "values": ["Value 1", "Value 2"],
      "tagline": "Brand tagline"
    },
    "brandPositioning": {
      "targetAudience": "Target audience description",
      "uniqueValueProposition": "What makes this brand unique"
    },
    "isActive": true,
    "isFeatured": false,
    "isVerified": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Brand

**PUT** `/brands/:id`

Update an existing brand (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id` (string) - Brand ID

**Request Body:** (All fields optional)

```json
{
  "name": "Updated Brand Name",
  "description": "Updated description",
  "isFeatured": true,
  "brandIdentity": {
    "mission": "Updated mission statement",
    "tagline": "Updated tagline"
  },
  "brandPositioning": {
    "targetAudience": "Updated target audience"
  }
}
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "_id": "brand_id",
    "name": "Updated Brand Name",
    "slug": "updated-brand-slug",
    "description": "Updated description",
    "isFeatured": true,
    "brandIdentity": {
      "mission": "Updated mission statement",
      "tagline": "Updated tagline"
    },
    "brandPositioning": {
      "targetAudience": "Updated target audience"
    },
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Brand

**DELETE** `/brands/:id`

Delete a brand (Admin only). Cannot delete brands with products.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id` (string) - Brand ID

**Response Format:**

```json
{
  "success": true,
  "message": "Brand deleted successfully"
}
```

### 6. Get Brand Analytics

**GET** `/brands/:id/analytics`

Get detailed analytics for a brand (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id` (string) - Brand ID

**Response Format:**

```json
{
  "success": true,
  "data": {
    "brand": {
      "id": "brand_id",
      "name": "Brand Name",
      "slug": "brand-slug",
      "viewCount": 0,
      "isVerified": true
    },
    "products": {
      "totalProducts": 0,
      "activeProducts": 0,
      "averagePrice": 0,
      "totalValue": 0,
      "categories": [
        {
          "categoryId": "category_id",
          "categoryName": "Category Name",
          "productCount": 0
        }
      ]
    },
    "reviews": {
      "totalReviews": 0,
      "averageRating": 0,
      "ratingDistribution": {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      }
    },
    "performance": {
      "views": 0,
      "engagement": 0
    }
  }
}
```

### 7. Get Top Performing Brands

**GET** `/brands/top-performing`

Get top performing brands based on various metrics.

**Query Parameters:**

- `limit` (number, default: 10) - Number of brands to return
- `metric` (string, default: "rating") - Metric to sort by ("rating", "products", "views", "reviews")
- `category` (string) - Filter by category ID
- `timeframe` (string, default: "all") - Timeframe for metrics ("week", "month", "year", "all")

**Example Request:**

```bash
GET /api/v1/brands/top-performing?limit=5&metric=rating&timeframe=month
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "brand_id",
      "name": "Brand Name",
      "slug": "brand-slug",
      "logo": "logo_url",
      "averageRating": 4.8,
      "totalReviews": 150,
      "productCount": 25,
      "viewCount": 1000,
      "rank": 1
    }
  ]
}
```

### 8. Search Brands

**GET** `/brands/search`

Search brands with advanced filtering.

**Query Parameters:**

- `q` (string) - Search query
- `category` (string) - Filter by category
- `country` (string) - Filter by country
- `isVerified` (boolean) - Filter by verification status
- `minRating` (number) - Minimum rating filter
- `sort` (string, default: "relevance") - Sort by ("relevance", "rating", "name", "products")

**Example Request:**

```bash
GET /api/v1/brands/search?q=tech&category=electronics&minRating=4&sort=rating
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "brand_id",
      "name": "Brand Name",
      "slug": "brand-slug",
      "logo": "logo_url",
      "description": "Brand description",
      "averageRating": 4.5,
      "productCount": 15,
      "relevanceScore": 0.95
    }
  ],
  "total": 25
}
```

### 9. Bulk Update Brands

**PUT** `/brands/bulk/update`

Update multiple brands at once (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "brands": [
    {
      "id": "brand_id_1",
      "isFeatured": true,
      "sortOrder": 1
    },
    {
      "id": "brand_id_2",
      "isActive": false
    }
  ]
}
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "updated": [
      {
        "_id": "brand_id_1",
        "name": "Brand Name",
        "isFeatured": true,
        "sortOrder": 1
      }
    ],
    "errors": [
      {
        "id": "brand_id_2",
        "error": "Brand not found"
      }
    ]
  },
  "message": "Updated 1 brands, 1 failed"
}
```

### 10. Get Brand Statistics

**GET** `/brands/statistics`

Get overall brand statistics (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "totalBrands": 0,
    "activeBrands": 0,
    "verifiedBrands": 0,
    "featuredBrands": 0,
    "averageRating": 0,
    "totalProducts": 0,
    "topCategories": [
      {
        "categoryId": "category_id",
        "categoryName": "Category Name",
        "brandCount": 0
      }
    ],
    "topCountries": [
      {
        "country": "Country Name",
        "brandCount": 0
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Brand with this name already exists"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Brand not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to create brand"
}
```

## Brand Identity Fields

Each brand includes comprehensive identity and positioning fields:

### brandIdentity Object

```json
{
  "mission": "Brand's mission statement and purpose",
  "vision": "Brand's vision for the future",
  "values": ["Core value 1", "Core value 2", "Core value 3"],
  "tagline": "Brand's memorable tagline",
  "story": "Brand's history and story"
}
```

### brandPositioning Object

```json
{
  "targetAudience": "Specific customer segments the brand serves",
  "uniqueValueProposition": "What makes this brand unique",
  "competitiveAdvantage": "Brand's competitive advantages",
  "marketPosition": "Brand's position in the market"
}
```

## Brand Features

### Social Media Integration

- **Multiple Platforms**: Facebook, Twitter, Instagram, LinkedIn, YouTube
- **Verified Status**: Track brand verification status
- **Contact Information**: Email, phone, and address details

### SEO and Metadata

- **Slugs**: URL-friendly identifiers
- **Meta Titles**: SEO-optimized page titles
- **Meta Descriptions**: Search result descriptions
- **Keywords**: Search optimization terms

### Analytics and Performance

- **View Counts**: Track brand popularity
- **Product Counts**: Number of products per brand
- **Review Statistics**: Average ratings and review counts
- **Performance Metrics**: Comprehensive analytics

### Brand Management

- **Featured Brands**: Highlight important brands
- **Sort Order**: Custom ordering for display
- **Active Status**: Enable/disable brands
- **Category Association**: Link brands to multiple categories

## Best Practices

1. **Brand Identity**: Define clear mission, vision, and values for each brand
2. **Positioning**: Establish unique value proposition and target audience
3. **SEO Optimization**: Use relevant keywords in meta titles and descriptions
4. **Content Quality**: Provide detailed descriptions and high-quality images
5. **Performance Monitoring**: Regularly review analytics to optimize brand performance
6. **Verification**: Verify authentic brands to build trust with customers
