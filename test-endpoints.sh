#!/bin/bash

# Simple test script for Builder.io MCP endpoints
# Note: These will fail without proper Builder.io API keys in .env

echo "Testing Builder.io MCP Server Endpoints"
echo "========================================"

BASE_URL="http://localhost:3000"

echo ""
echo "1. Health Check:"
curl -s "$BASE_URL/health" | jq '.'

echo ""
echo "2. API Documentation:"
curl -s "$BASE_URL/" | jq '.name, .version, .description'

echo ""
echo "3. Models endpoint (will fail without API keys):"
curl -s "$BASE_URL/models" | jq '.'

echo ""
echo "4. Generate Types endpoint (will fail without API keys):"
curl -s "$BASE_URL/generate-types" | jq '.'

echo ""
echo "5. Content endpoint for 'page' model (will fail without API keys):"
curl -s "$BASE_URL/content/page" | jq '.'

echo ""
echo "Test completed. To fully test, add your Builder.io API keys to .env file:"
echo "- BUILDER_API_KEY=your_api_key"
echo "- BUILDER_PRIVATE_KEY=your_private_key"
echo "- BUILDER_SPACE_ID=your_space_id"
