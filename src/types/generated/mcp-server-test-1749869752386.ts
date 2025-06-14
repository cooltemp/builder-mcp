// Auto-generated TypeScript interfaces for mcp-server-test-1749869752386 content
// Generated on: 2025-06-14T03:01:41.042Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IMcpServerTest1749869752386Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IMcpServerTest1749869752386Data;
}

// Data structure (nested under 'data' property in content)
export interface IMcpServerTest1749869752386Data {
  title: string;
}
