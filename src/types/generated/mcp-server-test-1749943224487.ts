// Auto-generated TypeScript interfaces for mcp-server-test-1749943224487 content
// Generated on: 2025-06-14T23:22:47.292Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IMcpServerTest1749943224487Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IMcpServerTest1749943224487Data;
}

// Data structure (nested under 'data' property in content)
export interface IMcpServerTest1749943224487Data {
  title: string;
}
