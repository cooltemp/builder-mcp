// Test setup file for Vitest
import { config } from 'dotenv';

// Load environment variables for testing
config();

// Ensure required environment variables are present
if (!process.env.BUILDER_API_KEY || !process.env.BUILDER_PRIVATE_KEY) {
  console.warn('⚠️  Warning: Builder.io API keys not found in environment variables.');
  console.warn('   Tests that require API access will be skipped.');
  console.warn('   Add BUILDER_API_KEY and BUILDER_PRIVATE_KEY to .env file to run full tests.');
}

// Set test environment
process.env.NODE_ENV = 'test';
