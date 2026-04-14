#!/bin/bash

# Setup script for CodeMaster Angular version
# This script copies necessary files from parent directories

echo "Setting up CodeMaster Angular application..."

# Create directories if they don't exist
mkdir -p public/assets/images
mkdir -p public/data

# Copy data files
echo "Copying data files..."
cp ../data/content.json public/data/ 2>/dev/null || echo "Note: content.json not found in parent data directory"

# Copy images
echo "Copying image assets..."
cp -r ../images/* public/assets/images/ 2>/dev/null || echo "Note: images not found in parent images directory"

echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm start' to start the development server"
echo "3. Open http://localhost:4200 in your browser"
