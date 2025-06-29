#!/bin/bash

# Create script directory if it doesn't exist
mkdir -p script

# Run the Node.js setup script
node script/setup.js

# Initialize git repository
git init

# Install dependencies
npm install

echo "Project setup completed!" 