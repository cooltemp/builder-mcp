// Auto-generated TypeScript interfaces for blog-post content
// Generated on: 2025-06-14T03:01:41.043Z

import type { BuilderReference } from '@/types';
import type { IAuthorContent } from '@/types/generated';

// Content entry structure (full response from Content API)
export interface IBlogPostContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IBlogPostData;
}

// Data structure (nested under 'data' property in content)
export interface IBlogPostData {
  category: BuilderReference;
  slug?: string;
  summary?: string;
  thumbnail?: string;
  mainImage?: string;
  body?: string;
  media?: Array<{file?: string}>;
  featured?: boolean;
  author?: BuilderReference<IAuthorContent>;
}
