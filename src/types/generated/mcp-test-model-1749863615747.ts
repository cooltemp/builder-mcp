// Auto-generated TypeScript interfaces for mcp-test-model-1749863615747 content
// Generated on: 2025-06-14T03:01:41.041Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IMcpTestModel1749863615747Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IMcpTestModel1749863615747Data;
}

// Data structure (nested under 'data' property in content)
export interface IMcpTestModel1749863615747Data {
  title: string;
  content?: string;
}
