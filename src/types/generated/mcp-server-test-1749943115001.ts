// Auto-generated TypeScript interfaces for mcp-server-test-1749943115001 content
// Generated on: 2025-06-14T23:22:47.293Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IMcpServerTest1749943115001Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IMcpServerTest1749943115001Data;
}

// Data structure (nested under 'data' property in content)
export interface IMcpServerTest1749943115001Data {
  title: string;
}
