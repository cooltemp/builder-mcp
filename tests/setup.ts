import { jest } from '@jest/globals';

// Setup test environment
process.env.NODE_ENV = 'test';
process.env.BUILDER_PUBLIC_API_KEY = 'test-public-key';
process.env.BUILDER_PRIVATE_API_KEY = 'test-private-key';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test timeout
jest.setTimeout(30000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global teardown
afterAll(async () => {
  // Clean up any resources
});

export {};
