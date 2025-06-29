# Product API Endpoints

Base URL: `/api/v1/products`

---

## 1. Create Product

**POST** `/api/v1/products`

- **Description:** Create a new product (admin only)
- **Headers:**
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: multipart/form-data`
- **Body:**
  - Form fields: `name`, `description`, `price`, `category`, `brand`, `stock`
  - Files: `images` (up to 5, type: File)
- **Response:**
  - Success: Product object with image URLs

---

## 2. Get All Products

**GET** `/api/v1/products`

- **Description:** Retrieve a list of all products
- **Response:**
  - Success: Array of product objects

---

## 3. Get Single Product

**GET** `/api/v1/products/:id`

- **Description:** Retrieve a single product by its ID
- **Response:**
  - Success: Product object

---

## 4. Update Product

**PUT** `/api/v1/products/:id`

- **Description:** Update an existing product (admin only)
- **Headers:**
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: multipart/form-data`
- **Body:**
  - Form fields: Any updatable product fields
  - Files: `images` (up to 5, type: File, optional)
- **Response:**
  - Success: Updated product object

---

## 5. Delete Product

**DELETE** `/api/v1/products/:id`

- **Description:** Delete a product by its ID (admin only)
- **Headers:**
  - `Authorization: Bearer <admin_jwt_token>`
- **Response:**
  - Success: Deletion confirmation message

---
