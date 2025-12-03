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

echo "Starting Kali Docker container..."
$DOCKER_COMPOSE up -d

if [ $? -eq 0 ]; then
    echo "✓ Container started successfully"
    echo ""
    echo "Container status:"
    $DOCKER_COMPOSE ps
else
    echo "✗ Failed to start container"
    exit 1
fi
