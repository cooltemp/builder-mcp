// Auto-generated TypeScript interfaces for page content
// Generated on: 2025-06-13T11:01:54.230Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IPageContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IPageData;
}

// Data structure (nested under 'data' property in content)
export interface IPageData {
  blocks?: any;
  title?: string;
  description?: string;
  image?: string;
  list?: Array<{image1?: string}>;
}
