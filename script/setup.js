const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the project structure
const projectStructure = {
    'config': ['db.js', 'keys.js', 'env.js'],
    'controllers': [
        'authController.js',
        'brandController.js',
        'cartController.js',
        'categoryController.js',
        'couponController.js',
        'orderController.js',
        'paymentController.js',
        'productController.js',
        'reviewController.js',
        'shippingController.js',
        'userController.js',
        'wishlistController.js'
    ],
    'middlewares': [
        'authMiddleware.js',
        'errorHandler.js',
        'validateRequest.js'
    ],
    'models': [
        'Brand.js',
        'Cart.js',
        'Category.js',
        'Coupon.js',
        'Order.js',
        'Payment.js',
        'Product.js',
        'Review.js',
        'Shipping.js',
        'User.js',
        'Wishlist.js'
    ],
    'routes': [
        'authRoutes.js',
        'brandRoutes.js',
        'cartRoutes.js',
        'categoryRoutes.js',
        'couponRoutes.js',
        'orderRoutes.js',
        'paymentRoutes.js',
        'productRoutes.js',
        'reviewRoutes.js',
        'shippingRoutes.js',
        'userRoutes.js',
        'wishlistRoutes.js'
    ],
    'services': [
        'authService.js',
        'brandService.js',
        'cartService.js',
        'categoryService.js',
        'couponService.js',
        'orderService.js',
        'paymentService.js',
        'productService.js',
        'reviewService.js',
        'shippingService.js',
        'userService.js',
        'wishlistService.js'
    ],
    'utils': [
        'emailService.js',
        'jwtUtils.js',
        'logger.js'
    ],
    'validators': [
        'authValidator.js',
        'brandValidator.js',
        'cartValidator.js',
        'categoryValidator.js',
        'couponValidator.js',
        'orderValidator.js',
        'paymentValidator.js',
        'productValidator.js',
        'reviewValidator.js',
        'shippingValidator.js',
        'userValidator.js',
        'wishlistValidator.js'
    ]
};

// Function to create directory if it doesn't exist
function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

// Function to create file with basic content
function createFile(filePath, content = '') {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
    }
}

// Function to run shell commands
function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

// Create project structure
async function createProjectStructure() {
    console.log('Starting project setup...\n');

    // Create main directories and their files
    for (const [dir, files] of Object.entries(projectStructure)) {
        const dirPath = path.join(process.cwd(), dir);
        createDirectory(dirPath);

        // Create files in each directory
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            createFile(filePath);
        });
    }

    // Write root files with content (do not create empty files first)
    // Create package.json with basic content
    const packageJson = {
        "name": "e-commerce-api",
        "version": "1.0.0",
        "description": "E-commerce API using Express and Mongoose",
        "main": "app.js",
        "scripts": {
            "start": "node app.js",
            "dev": "nodemon app.js"
        },
        "dependencies": {
            "express": "^4.18.2",
            "mongoose": "^7.0.0",
            "dotenv": "^16.0.3",
            "bcryptjs": "^2.4.3",
            "jsonwebtoken": "^9.0.0",
            "cors": "^2.8.5",
            "helmet": "^6.0.1",
            "morgan": "^1.10.0",
            "express-validator": "^7.0.1"
        },
        "devDependencies": {
            "nodemon": "^2.0.22"
        }
    };
    fs.writeFileSync(
        path.join(process.cwd(), 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
    console.log('Created file: package.json');

    // Create basic .gitignore
    const gitignoreContent = `
node_modules/
.env
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
    `.trim();
    fs.writeFileSync(
        path.join(process.cwd(), '.gitignore'),
        gitignoreContent
    );
    console.log('Created file: .gitignore');

    // Create basic README.md
    const readmeContent = `
# E-commerce API

A RESTful API for an e-commerce platform built with Express.js and MongoDB.

## Features

- User authentication and authorization
- Product management
- Category and brand management
- Shopping cart functionality
- Order processing
- Payment integration
- Review system
- Wishlist management
- Coupon system
- Shipping management

## Setup

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Create a .env file with required environment variables
4. Run the development server: \`npm run dev\`

## Environment Variables

Create a .env file with the following variables:

\`\`\`
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
\`\`\`
    `.trim();
    fs.writeFileSync(
        path.join(process.cwd(), 'README.md'),
        readmeContent
    );
    console.log('Created file: README.md');

    // Create basic app.js
    const appJsContent = `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
// TODO: Import and use routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
    `.trim();
    fs.writeFileSync(
        path.join(process.cwd(), 'app.js'),
        appJsContent
    );
    console.log('Created file: app.js');

    // Create empty .env file if it doesn't exist
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, '');
        console.log('Created file: .env');
    }

    console.log('\nProject structure created successfully!');

    // Initialize git repository
    console.log('\nInitializing git repository...');
    runCommand('git init');

    // Install dependencies
    console.log('\nInstalling dependencies...');
    runCommand('npm install');

    console.log('\nProject setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Configure your .env file');
    console.log('2. Start implementing your features');
    console.log('3. Run the development server: npm run dev');
}

// Execute the script
createProjectStructure().catch(error => {
    console.error('Error during project setup:', error);
    process.exit(1);
}); 