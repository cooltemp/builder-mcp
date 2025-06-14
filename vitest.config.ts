import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 30000, // 30 seconds for API calls
    hookTimeout: 10000, // 10 seconds for setup/teardown
    sequence: {
      concurrent: false, // Run tests sequentially within each file
      shuffle: false, // Don't shuffle test order
    },
  },
  cacheDir: './tests/.vitest',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
