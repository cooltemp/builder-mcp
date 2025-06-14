// Auto-generated TypeScript interfaces for mcp-server-test-1749869265779 content
// Generated on: 2025-06-14T03:01:41.041Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IMcpServerTest1749869265779Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IMcpServerTest1749869265779Data;
}

// Data structure (nested under 'data' property in content)
export interface IMcpServerTest1749869265779Data {
  title: string;
}
