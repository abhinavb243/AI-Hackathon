#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Compliance AI System with Mock Data${NC}"
echo ""

# Step 1: First upload the mock company data practices
echo -e "${BLUE}Step 1: Uploading mock company data practices...${NC}"
COMPANY_DATA_RESULT=$(curl -s -X POST "http://localhost:8000/direct-db/upload-mock-company-practices" \
  -H "Content-Type: application/json" \
  -d @mock_company_data.json)

echo "$COMPANY_DATA_RESULT" | grep -q "success"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Successfully uploaded mock company data practices${NC}"
else
    echo -e "${RED}✗ Failed to upload mock company data practices${NC}"
    echo "$COMPANY_DATA_RESULT"
    exit 1
fi
echo ""

# Step 2: Test the full compliance pipeline with the mock regulation
echo -e "${BLUE}Step 2: Testing full compliance pipeline with mock regulation...${NC}"
PIPELINE_RESULT=$(curl -s -X POST "http://localhost:8000/run-pipeline" \
  -H "Content-Type: application/json" \
  -d '{"mock_regulation": '$(cat mock_gdpr_regulation.json)', "use_mock_company_data": true}')

echo "$PIPELINE_RESULT" | grep -q "success"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Successfully ran compliance pipeline${NC}"
    
    # Extract and display the number of findings
    FINDINGS_COUNT=$(echo "$PIPELINE_RESULT" | grep -o "Found [0-9]* issues" | grep -o "[0-9]*")
    if [ -n "$FINDINGS_COUNT" ]; then
        echo -e "${GREEN}✓ Detected $FINDINGS_COUNT compliance issues${NC}"
    fi
    
    # Check if we can get severity
    SEVERITY=$(echo "$PIPELINE_RESULT" | grep -o '"severity"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"')
    if [ -n "$SEVERITY" ]; then
        echo -e "${GREEN}✓ Overall compliance severity: $SEVERITY${NC}"
    fi
    
    # Check impact areas
    IMPACT_AREAS=$(echo "$PIPELINE_RESULT" | grep -o '"impact_areas"[[:space:]]*:[[:space:]]*\[[^]]*\]' | head -1)
    if [ -n "$IMPACT_AREAS" ]; then
        echo -e "${GREEN}✓ Impact areas identified${NC}"
    fi
    
    # Check financial impact
    FINANCIAL_IMPACT=$(echo "$PIPELINE_RESULT" | grep -o '"estimated_cost"[[:space:]]*:[[:space:]]*[0-9]*' | head -1 | grep -o '[0-9]*$')
    if [ -n "$FINANCIAL_IMPACT" ]; then
        echo -e "${GREEN}✓ Estimated financial impact: $FINANCIAL_IMPACT${NC}"
    fi
else
    echo -e "${RED}✗ Failed to run compliance pipeline${NC}"
    echo "$PIPELINE_RESULT"
    exit 1
fi

echo ""
echo -e "${BLUE}Test completed. To view detailed results, check the response above.${NC}"
echo -e "${BLUE}For a more detailed view, access the full report through the frontend.${NC}" 