// Auto-generated TypeScript interfaces for mcp-tools-test-1749943625316 content
// Generated on: 2025-06-14T23:27:52.198Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IMcpToolsTest1749943625316Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IMcpToolsTest1749943625316Data;
}

// Data structure (nested under 'data' property in content)
export interface IMcpToolsTest1749943625316Data {
  title: string;
}
