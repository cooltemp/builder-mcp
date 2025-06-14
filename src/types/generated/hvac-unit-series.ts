// Auto-generated TypeScript interfaces for hvac-unit-series content
// Generated on: 2025-06-14T23:22:51.987Z

import type { BuilderReference } from '@/types';
import type { IHVACBrandContent, IHVACServicingContent } from '@/types/generated';

// Content entry structure (full response from Content API)
export interface IHVACUnitSeriesContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IHVACUnitSeriesData;
}

// Data structure (nested under 'data' property in content)
export interface IHVACUnitSeriesData {
  brand?: BuilderReference<IHVACBrandContent>;
  class?: "Basic" | "Plus" | "Premium";
  seriesCode?: string;
  description?: string;
  unitConfig?: "High Wall Mounted" | "Central Ducted" | "Ceiling Mounted" | "Multi-Split System" | "Floor Console";
  thumbnailImage?: string;
  media?: Array<{file: string}>;
  sizes?: Array<{sku?: string}>;
  keyFeatures?: Array<{heading: string; summary?: string; subFeatures?: Array<{heading: string; summary?: string}>; icon?: any}>;
  color?: Array<{name?: string; color?: string}>;
  smartFeatures?: {appControl: boolean; voiceControl: boolean; homeAutomationIntegration: boolean; energyTracking: boolean};
  airFiltration?: {hepaFilter?: boolean; hepaGrade?: string; pm25Filtration?: string; antibacterialFilter?: boolean; deodorisingFilter?: boolean; dustCollectionFilter?: boolean; filterLifespan?: string};
  warrantyOptions?: Array<{type: "Parts" | "Labor" | "Compressor" | "Full Coverage"; durationYears: number; termsAndConditionsLink?: string; transferable: boolean; extendedWarrantyAvailable?: boolean; documents?: Array<{name?: string; file: string}>}>;
  relatedAccessories?: Array<{accessory?: BuilderReference}>;
  servicePlans?: Array<{plan?: BuilderReference<IHVACServicingContent>}>;
  documents?: Array<{name?: "Brochure" | "Operation Manual / User Guide" | "Installation Manual" | "Wifi Control Instructions"; file?: string}>;
}
