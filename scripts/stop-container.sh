#!/bin/bash

echo "Stopping Kali Docker container..."
docker-compose down

if [ $? -eq 0 ]; then
    echo "✓ Container stopped successfully"
else
    echo "✗ Failed to stop container"
    exit 1
fi
