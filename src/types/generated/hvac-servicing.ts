// Auto-generated TypeScript interfaces for hvac-servicing content
// Generated on: 2025-06-14T23:22:47.294Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IHVACServicingContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IHVACServicingData;
}

// Data structure (nested under 'data' property in content)
export interface IHVACServicingData {
  summary?: string;
  icon?: any;
  type?: "Annual Heat Pump Service" | "Deep Clean";
  description?: string;
}
