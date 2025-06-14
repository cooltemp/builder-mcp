// Auto-generated TypeScript interfaces for categories content
// Generated on: 2025-06-14T03:01:41.045Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface ICategoriesContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: ICategoriesData;
}

// Data structure (nested under 'data' property in content)
export interface ICategoriesData {

}
