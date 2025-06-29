# Category API Documentation

## Base URL

```
http://localhost:5000/api/v1/categories
```

## Authentication

- **Public endpoints**: No authentication required
- **Protected endpoints**: Require JWT token with admin role

## Endpoints

### 1. Get All Categories

**GET** `/categories`

Retrieve all categories with optional filtering and pagination.

**Query Parameters:**

- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 20) - Number of items per page
- `sort` (string, default: "name") - Field to sort by
- `order` (string, default: "asc") - Sort order ("asc" or "desc")
- `search` (string) - Search term for name or description
- `parent` (string) - Filter by parent category ID (use "null" for root categories)
- `isActive` (boolean) - Filter by active status
- `isFeatured` (boolean) - Filter by featured status
- `level` (number) - Filter by category level
- `includeProducts` (boolean) - Include product count for each category

**Example Request:**

```bash
GET /api/v1/categories?page=1&limit=10&search=electronics&isActive=true
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Category Name",
      "slug": "category-slug",
      "description": "Category description",
      "longDescription": "Detailed category description",
      "parent": "parent_category_id",
      "level": 0,
      "path": [],
      "metaTitle": "SEO title",
      "metaDescription": "SEO description",
      "keywords": ["keyword1", "keyword2"],
      "image": "image_url",
      "icon": "icon_name",
      "categoryDesign": {
        "pointOfView": "Category point of view",
        "valueProposition": "Category value proposition",
        "targetAudience": "Target audience",
        "competitiveAdvantage": "Competitive advantage"
      },
      "isActive": true,
      "isFeatured": false,
      "sortOrder": 1,
      "viewCount": 0,
      "productCount": 0,
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

### 2. Get Category Tree

**GET** `/categories/tree`

Retrieve the complete category hierarchy as a tree structure.

**Query Parameters:**

- `includeProducts` (boolean) - Include product count for each category

**Example Request:**

```bash
GET /api/v1/categories/tree?includeProducts=true
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Parent Category",
      "slug": "parent-category",
      "level": 0,
      "productCount": 0,
      "children": [
        {
          "_id": "child_category_id",
          "name": "Child Category",
          "slug": "child-category",
          "level": 1,
          "productCount": 0,
          "children": []
        }
      ]
    }
  ]
}
```

### 3. Get Single Category

**GET** `/categories/:id`

Retrieve a single category by ID or slug.

**Path Parameters:**

- `id` (string) - Category ID or slug

**Query Parameters:**

- `includeProducts` (boolean) - Include products in response
- `includeChildren` (boolean) - Include child categories

**Example Request:**

```bash
GET /api/v1/categories/electronics?includeProducts=true&includeChildren=true
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description",
    "parent": "parent_category_id",
    "path": [],
    "categoryDesign": {
      "pointOfView": "Category point of view",
      "valueProposition": "Category value proposition",
      "targetAudience": "Target audience",
      "competitiveAdvantage": "Competitive advantage"
    },
    "children": [
      {
        "_id": "child_category_id",
        "name": "Child Category",
        "slug": "child-category"
      }
    ],
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "brand": {
          "_id": "brand_id",
          "name": "Brand Name",
          "logo": "logo_url"
        }
      }
    ]
  }
}
```

### 4. Create Category

**POST** `/categories`

Create a new category (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "Category Name",
  "description": "Short description",
  "longDescription": "Detailed description",
  "parent": "parent_category_id",
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": ["keyword1", "keyword2"],
  "image": "image_url",
  "icon": "icon_name",
  "categoryDesign": {
    "pointOfView": "Your unique perspective",
    "valueProposition": "Your value proposition",
    "targetAudience": "Your target audience",
    "competitiveAdvantage": "Your competitive advantage"
  },
  "isActive": true,
  "isFeatured": false,
  "sortOrder": 1,
  "customFields": {
    "customKey": "customValue"
  }
}
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Short description",
    "parent": "parent_category_id",
    "level": 1,
    "path": ["parent_category_id"],
    "categoryDesign": {
      "pointOfView": "Your unique perspective",
      "valueProposition": "Your value proposition",
      "targetAudience": "Your target audience",
      "competitiveAdvantage": "Your competitive advantage"
    },
    "isActive": true,
    "isFeatured": false,
    "sortOrder": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 5. Update Category

**PUT** `/categories/:id`

Update an existing category (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id` (string) - Category ID

**Request Body:** (All fields optional)

```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "isFeatured": true,
  "categoryDesign": {
    "pointOfView": "Updated point of view",
    "valueProposition": "Updated value proposition"
  }
}
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "name": "Updated Category Name",
    "slug": "updated-category-slug",
    "description": "Updated description",
    "isFeatured": true,
    "categoryDesign": {
      "pointOfView": "Updated point of view",
      "valueProposition": "Updated value proposition"
    },
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 6. Delete Category

**DELETE** `/categories/:id`

Delete a category (Admin only). Cannot delete categories with products or children.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id` (string) - Category ID

**Response Format:**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### 7. Get Category Analytics

**GET** `/categories/:id/analytics`

Get detailed analytics for a category (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id` (string) - Category ID

**Response Format:**

```json
{
  "success": true,
  "data": {
    "category": {
      "id": "category_id",
      "name": "Category Name",
      "slug": "category-slug",
      "level": 0,
      "viewCount": 0
    },
    "hierarchy": {
      "parent": "parent_category_id",
      "childrenCount": 5,
      "totalLevels": 3
    },
    "products": {
      "totalProducts": 0,
      "activeProducts": 0,
      "averagePrice": 0,
      "totalValue": 0
    },
    "views": 0
  }
}
```

### 8. Bulk Update Categories

**PUT** `/categories/bulk/update`

Update multiple categories at once (Admin only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "categories": [
    {
      "id": "category_id_1",
      "isFeatured": true,
      "sortOrder": 1
    },
    {
      "id": "category_id_2",
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
        "_id": "category_id_1",
        "name": "Category Name",
        "isFeatured": true,
        "sortOrder": 1
      }
    ],
    "errors": [
      {
        "id": "category_id_2",
        "error": "Category not found"
      }
    ]
  },
  "message": "Updated 1 categories, 1 failed"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Category with this name already exists"
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
  "error": "Category not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to create category"
}
```

## Category Design Fields

Each category includes strategic positioning fields:

### categoryDesign Object

```json
{
  "pointOfView": "Your unique perspective on the market",
  "valueProposition": "What value the category provides to customers",
  "targetAudience": "Specific customer segments the category serves",
  "competitiveAdvantage": "What makes this category different from others"
}
```

## Category Hierarchy

- **Parent-Child Relationships**: Categories can have parent categories
- **Level Tracking**: Automatic depth level calculation
- **Path Tracking**: Full breadcrumb path from root to current category
- **Tree Building**: Efficient tree structure generation

## SEO and Metadata

- **Slugs**: URL-friendly identifiers
- **Meta Titles**: SEO-optimized page titles
- **Meta Descriptions**: Search result descriptions
- **Keywords**: Search optimization terms

## Analytics and Performance

- **View Counts**: Track category popularity
- **Product Counts**: Number of products in each category
- **Performance Metrics**: Comprehensive analytics

## Best Practices

1. **Category Naming**: Use clear, descriptive names that customers understand
2. **Hierarchy Depth**: Limit category depth to 3-4 levels for optimal user experience
3. **SEO Optimization**: Use relevant keywords in meta titles and descriptions
4. **Category Design**: Define clear point of view and value proposition for each category
5. **Performance Monitoring**: Regularly review analytics to optimize category performance
