#!/bin/bash

echo "=========================================="
echo "🐳 FIXIA DOCKER STABILITY TEST"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: Docker availability
echo "Test 1: Docker availability..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}: Docker installed"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Docker not installed"
    ((FAILED++))
    exit 1
fi

# Test 2: docker-compose availability
echo "Test 2: docker-compose availability..."
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}: docker-compose installed"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: docker-compose not installed"
    ((FAILED++))
    exit 1
fi

# Test 3: Check if .env exists
echo "Test 3: Environment file..."
if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ PASS${NC}: .env file found"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: No .env file - using defaults"
fi

# Test 4: Validate docker-compose.yml
echo "Test 4: Validating docker-compose.yml..."
if docker-compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}: docker-compose.yml valid"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: docker-compose.yml has errors"
    docker-compose config
    ((FAILED++))
fi

# Test 5: Build check
echo ""
echo "Test 5: Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Dockerfile exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Dockerfile not found"
    ((FAILED++))
fi

# Test 6: Port availability
echo "Test 6: Checking port 3000..."
if ! nc -z localhost 3000 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}: Port 3000 available"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: Port 3000 already in use"
fi

# Test 7: Port 5432 availability
echo "Test 7: Checking port 5432..."
if ! nc -z localhost 5432 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}: Port 5432 available"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: Port 5432 already in use"
fi

# Test 8: Disk space
echo "Test 8: Checking disk space..."
DISK_FREE=$(df . | awk 'NR==2 {print $4}')
if [ "$DISK_FREE" -gt 5242880 ]; then  # 5GB in KB
    echo -e "${GREEN}✅ PASS${NC}: Sufficient disk space (${DISK_FREE}KB)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Insufficient disk space"
    ((FAILED++))
fi

# Test 9: Node modules check
echo "Test 9: Checking node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Dependencies installed"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: node_modules not found - will install in Docker"
fi

# Summary
echo ""
echo "=========================================="
echo "📊 TEST RESULTS"
echo "=========================================="
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - Ready for deployment${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review DOCKER_DEPLOYMENT_GUIDE.md"
    echo "2. Set up Cloudflare tunnel token in .env"
    echo "3. Run: docker-compose up -d"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED - Fix issues before deploying${NC}"
    exit 1
fi

