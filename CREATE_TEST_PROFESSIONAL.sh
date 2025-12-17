#!/bin/bash

# Test Professional Account Creator
# Usage: ./CREATE_TEST_PROFESSIONAL.sh [name] [email] [category]
# Example: ./CREATE_TEST_PROFESSIONAL.sh "Plomero Test" "plomero@test.com" "plomeria"

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:3000}"
NAME="${1:-Test Professional}"
EMAIL="${2:-test-$(date +%s)@test.com}"
PASSWORD="${3:-Test123456!}"
CATEGORY="${4:-plomeria}"
PHONE="${5:-1234567890}"
DNI="${6:-12345678}"

echo -e "${BLUE}🚀 Creating Test Professional Account${NC}\n"

# Validate API is accessible
echo -e "${YELLOW}Checking API connection...${NC}"
if ! curl -s "$API_URL/api/health" > /dev/null 2>&1; then
  echo -e "${YELLOW}Note: Could not verify API health, but continuing...${NC}"
fi

echo -e "${YELLOW}Creating professional account...${NC}\n"

# Create professional account
RESPONSE=$(curl -s -X POST "$API_URL/api/dev/create-test-professional" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"phone\": \"$PHONE\",
    \"dni\": \"$DNI\",
    \"category\": \"$CATEGORY\"
  }")

# Check if creation was successful
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Account Created Successfully!${NC}\n"

  # Extract details using grep/sed (works on all platforms)
  USER_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  USER_EMAIL=$(echo "$RESPONSE" | grep -o '"email":"[^"]*' | head -1 | cut -d'"' -f4)

  echo -e "${GREEN}📋 Account Details:${NC}"
  echo -e "   Name: $NAME"
  echo -e "   Email: $EMAIL"
  echo -e "   Password: $PASSWORD"
  echo -e "   Category: $CATEGORY"
  echo -e "   Role: PROFESSIONAL"
  echo -e "   Status: VERIFIED"
  echo -e "   Subscription: ACTIVE (1 year)\n"

  echo -e "${GREEN}🎯 Features Enabled:${NC}"
  echo -e "   ✓ Can Create Services"
  echo -e "   ✓ Listing Visible"
  echo -e "   ✓ Can Receive Bookings"
  echo -e "   ✓ VERIFIED Badge\n"

  echo -e "${GREEN}🌐 Next Steps:${NC}"
  echo -e "   1. Visit: ${BLUE}$API_URL/login${NC}"
  echo -e "   2. Email: ${BLUE}$EMAIL${NC}"
  echo -e "   3. Password: ${BLUE}$PASSWORD${NC}"
  echo -e "   4. Dashboard: ${BLUE}$API_URL/dashboard${NC}"
  echo -e "   5. Create Service: ${BLUE}$API_URL/dashboard/services${NC}\n"

  echo -e "${GREEN}✨ Ready for testing!${NC}\n"

else
  echo -e "${RED}❌ Failed to create account${NC}\n"
  echo -e "${RED}Response:${NC}"
  echo "$RESPONSE" | grep -o '"error":"[^"]*' | cut -d'"' -f4
  exit 1
fi

# Save credentials to file for reference
CREDENTIALS_FILE="test-credentials-$(date +%s).json"
cat > "$CREDENTIALS_FILE" << EOF
{
  "name": "$NAME",
  "email": "$EMAIL",
  "password": "$PASSWORD",
  "category": "$CATEGORY",
  "url": "$API_URL/login",
  "created": "$(date)"
}
EOF

echo -e "${BLUE}💾 Credentials saved to: $CREDENTIALS_FILE${NC}\n"
