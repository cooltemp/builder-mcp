// Auto-generated TypeScript interfaces for hvac-brand content
// Generated on: 2025-06-14T03:01:41.047Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IHVACBrandContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IHVACBrandData;
}

// Data structure (nested under 'data' property in content)
export interface IHVACBrandData {
  logo?: string;
}
