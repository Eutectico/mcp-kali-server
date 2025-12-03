#!/bin/bash

# Detect docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "✗ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "Stopping Kali Docker container..."
$DOCKER_COMPOSE down

if [ $? -eq 0 ]; then
    echo "✓ Container stopped successfully"
else
    echo "✗ Failed to stop container"
    exit 1
fi
