#!/usr/bin/env tsx

// Simple test runner script for Builder.io Models API tests
// Usage: npm run test:models or tsx tests/run-models-test.ts

import { config } from 'dotenv';

// Load environment variables
config();

console.log('🧪 Builder.io Models API Test Runner');
console.log('=====================================');

// Check for required environment variables
const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;

if (!hasApiKeys) {
  console.log('❌ Missing required environment variables:');
  console.log('   - BUILDER_API_KEY');
  console.log('   - BUILDER_PRIVATE_KEY');
  console.log('');
  console.log('💡 Add these to your .env file to run the tests:');
  console.log('   BUILDER_API_KEY=your_api_key_here');
  console.log('   BUILDER_PRIVATE_KEY=your_private_key_here');
  console.log('');
  console.log('⚠️  Tests will be skipped without proper API credentials.');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('🚀 Running models tests...');
console.log('');

// Import and run the test
import('./models.test.ts');
