// Auto-generated TypeScript interfaces for author content
// Generated on: 2025-06-14T03:01:41.046Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IAuthorContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IAuthorData;
}

// Data structure (nested under 'data' property in content)
export interface IAuthorData {
  thumbnail?: string;
}
