// Auto-generated TypeScript interfaces for hvac-unit-accessories content
// Generated on: 2025-06-14T03:01:41.047Z

import type { BuilderReference } from '@/types';

// Content entry structure (full response from Content API)
export interface IHVACUnitAccessoriesContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IHVACUnitAccessoriesData;
}

// Data structure (nested under 'data' property in content)
export interface IHVACUnitAccessoriesData {
  brand?: string;
  summary?: string;
  description?: string;
  thumbnailImage?: string;
  media?: Array<{file: string}>;
  keyFeatures?: Array<{heading: string; summary?: string; subFeatures?: Array<{heading: string; summary?: string}>; icon?: any}>;
  color?: Array<{name?: string; color?: string}>;
  warrantyOptions?: Array<{type: "Parts" | "Labor" | "Compressor" | "Full Coverage"; durationYears: number; termsAndConditionsLink?: string; transferable: boolean; extendedWarrantyAvailable?: boolean; documents?: Array<{document: string}>}>;
  documents?: Array<{name?: "Brochure" | "Operation Manual / User Guide" | "Installation Manual" | "Wifi Control Instructions"; file?: string}>;
  show?: boolean;
  pricing?: {originalPrice?: string; currency?: string};
}
