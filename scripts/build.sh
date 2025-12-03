#!/bin/bash

echo "Building MCP Kali Server Docker image..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✓ Docker image built successfully"
else
    echo "✗ Failed to build Docker image"
    exit 1
fi

echo ""
echo "Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

echo ""
echo "Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ TypeScript compiled successfully"
    echo ""
    echo "Setup complete! You can now:"
    echo "  1. Start the server with: npm start"
    echo "  2. Or use it with Claude Desktop (see README.md)"
else
    echo "✗ Failed to compile TypeScript"
    exit 1
fi
