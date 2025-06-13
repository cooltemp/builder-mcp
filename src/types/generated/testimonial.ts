// Auto-generated TypeScript interfaces for testimonial content
// Generated on: 2025-06-13T11:01:54.229Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface ITestimonialContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: ITestimonialData;
}

// Data structure (nested under 'data' property in content)
export interface ITestimonialData {
  fullName?: string;
  date?: string;
  description?: string;
  rating?: number;
  image?: string;
}
