#!/bin/bash

echo "======================================"
echo "MCP Kali Server - Setup Test"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    errors=$((errors + 1))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    errors=$((errors + 1))
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${GREEN}✓${NC} $DOCKER_VERSION"

    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Docker daemon is running"
    else
        echo -e "  ${RED}✗${NC} Docker daemon is not running"
        errors=$((errors + 1))
    fi
else
    echo -e "${RED}✗${NC} Docker not found"
    errors=$((errors + 1))
fi

# Check Docker Compose
echo -n "Checking Docker Compose... "
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version --short)
    echo -e "${GREEN}✓${NC} $COMPOSE_VERSION"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${GREEN}✓${NC} $COMPOSE_VERSION"
else
    echo -e "${RED}✗${NC} Docker Compose not found"
    errors=$((errors + 1))
fi

# Check Claude CLI
echo -n "Checking Claude CLI... "
if command -v claude &> /dev/null; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC} Claude CLI not found (optional)"
fi

echo ""
echo "======================================"
echo "Project Files"
echo "======================================"

# Check if project is built
echo -n "TypeScript compiled... "
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Run: npm run build"
    errors=$((errors + 1))
fi

# Check if Docker image exists
echo -n "Docker image built... "
if docker images | grep -q "mcp-kali-server"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} Run: docker-compose build"
fi

# Check if container is running
echo -n "Container running... "
if docker ps | grep -q "mcp-kali"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} Run: ./scripts/start-container.sh"
fi

echo ""
echo "======================================"
echo "MCP Configuration"
echo "======================================"

# Check if MCP server is registered
echo -n "MCP server registered... "
if command -v claude &> /dev/null; then
    if claude mcp list 2>/dev/null | grep -q "kali"; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC} Run: claude mcp add --transport stdio kali -- node $(pwd)/dist/index.js"
    fi
else
    echo -e "${YELLOW}⚠${NC} Claude CLI not available"
fi

# Check .mcp.json exists
echo -n ".mcp.json file... "
if [ -f ".mcp.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Missing"
    errors=$((errors + 1))
fi

echo ""
echo "======================================"
echo "Summary"
echo "======================================"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start container: ./scripts/start-container.sh"
    echo "  2. Add to Claude CLI: claude mcp add --transport stdio kali -- node $(pwd)/dist/index.js"
    echo "  3. Test with: claude"
    echo ""
    echo "For usage examples, see: EXAMPLES.md"
else
    echo -e "${RED}Found $errors error(s)${NC}"
    echo ""
    echo "Please fix the errors above and run this script again."
    exit 1
fi
