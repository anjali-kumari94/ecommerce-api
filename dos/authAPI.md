# Authentication API Documentation

## Base URL

```
http://localhost:5000/api/v1/auth
```

## Authentication Endpoints

### 1. Register User

```http
POST /register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "createdAt": "2024-03-11T12:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### 2. Login User

```http
POST /login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### 3. Forgot Password

```http
POST /forgot-password
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 4. Reset Password

```http
POST /reset-password
```

**Request Body:**

```json
{
  "token": "reset_token_here",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### 5. Change Password

```http
POST /change-password
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Get Current User

```http
GET /me
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-03-11T12:00:00.000Z"
    }
  }
}
```

### 7. Update User Profile

```http
PUT /update-profile
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "+1987654321",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Updated",
      "email": "john@example.com",
      "phone": "+1987654321",
      "role": "user",
      "address": {
        "street": "456 New St",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90001",
        "country": "USA"
      },
      "updatedAt": "2024-03-11T13:00:00.000Z"
    }
  }
}
```

### 8. Logout

```http
POST /logout
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Profile Endpoints

### 1. Get User Profile

```http
GET /api/v1/users/profile
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-03-11T12:00:00.000Z"
    }
  }
}
```

### 2. Update User Profile

```http
PUT /api/v1/users/profile
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "+1987654321",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Updated",
      "email": "john@example.com",
      "phone": "+1987654321",
      "role": "user",
      "address": {
        "street": "456 New St",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90001",
        "country": "USA"
      },
      "createdAt": "2024-03-11T12:00:00.000Z"
    }
  }
}
```

### 3. Update User Password

```http
PUT /api/v1/users/password
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation error message"
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
  "error": "Route not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "error": "Server error message"
}
```

## Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Security Notes

1. All passwords must be at least 8 characters long
2. Passwords must contain at least one uppercase letter, one lowercase letter, one number, and one special character
3. JWT tokens expire after 7 days
4. Rate limiting is applied to prevent brute force attacks
5. All requests must be made over HTTPS in production
