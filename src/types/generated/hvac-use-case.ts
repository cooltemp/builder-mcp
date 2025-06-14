// Auto-generated TypeScript interfaces for hvac-use-case content
// Generated on: 2025-06-14T23:22:47.292Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IHVACUseCaseContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IHVACUseCaseData;
}

// Data structure (nested under 'data' property in content)
export interface IHVACUseCaseData {
  spaceArea?: string;
  spaceCeilingHeight?: string;
  spaceVolume?: string;
  powerCapacity?: string;
  order?: number;
}
