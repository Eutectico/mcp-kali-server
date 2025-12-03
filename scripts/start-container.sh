#!/bin/bash

echo "Starting Kali Docker container..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✓ Container started successfully"
    echo ""
    echo "Container status:"
    docker-compose ps
else
    echo "✗ Failed to start container"
    exit 1
fi
