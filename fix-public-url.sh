#!/bin/bash

# Script to fix %PUBLIC_URL% placeholders in React build files
# This is a backup solution in case the Docker build doesn't handle it properly

echo "Fixing %PUBLIC_URL% placeholders in build files..."

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "Build directory not found. Please run 'npm run build' first."
    exit 1
fi

# Fix HTML files
echo "Fixing HTML files..."
find build -name "*.html" -exec sed -i 's|%PUBLIC_URL%||g' {} \;

# Fix JavaScript files
echo "Fixing JavaScript files..."
find build -name "*.js" -exec sed -i 's|%PUBLIC_URL%||g' {} \;

# Fix CSS files
echo "Fixing CSS files..."
find build -name "*.css" -exec sed -i 's|%PUBLIC_URL%||g' {} \;

echo "✅ Fixed %PUBLIC_URL% placeholders in all build files"
echo "You can now deploy the fixed build files"
