// Auto-generated TypeScript interfaces for hvac-unit content
// Generated on: 2025-06-13T11:01:54.229Z

import type { BuilderReference } from '@/types';
import type { IHVACUnitSeriesContent, IHVACUseCaseContent } from '@/types/generated';

// Content entry structure (full response from Content API)
export interface IHVACUnitContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: IHVACUnitData;
}

// Data structure (nested under 'data' property in content)
export interface IHVACUnitData {
  series?: BuilderReference<IHVACUnitSeriesContent>;
  sku: string;
  model: string;
  useCase?: BuilderReference<IHVACUseCaseContent>;
  price?: {originalPrice: number; discountedPrice?: number; currency: string; isTaxIncluded: boolean; discountPercentage?: number; validFrom?: string; validUntil?: string; tieredPricing?: Array<{minQuantity: number; price: number}>; additionalFees?: Array<{feeType: "Shipping" | "Handling" | "Setup"; amount: number}>};
  stock?: "High Stock" | "In Stock" | "Low Stock" | "Very Low Stock" | "Out of Stock";
  powerCapacity?: {coolingKw: number; heatingKw: number; sizeKw: number; dehumidifyingCapacityLh: number};
  energyEfficiency?: {starRating: number; annualCoolingConsumptionKw: number; annualHeatingConsumptionKw: number; energyEfficiencyRatio: number; coefficientOfPerformance: number; annualEnergyEfficiencyRatio?: number; annualCoefficientOfPerformance?: number; zeroEnergyRatingLabel?: {coolingRating?: {coldRating: number; mixedRating: number; hotRating: number}; heatingRating?: {coldRating: number; mixedRating: number; hotRating: number}}; documents?: Array<{document: string}>};
  physicalAttributes?: {indoorUnit?: {width: number; height: number; depth: number; unit?: "mm" | "inches"; weight?: {value: number; unit?: "kg" | "lbs"}}; outdoorUnit?: {width: number; height: number; depth: number; unit?: "mm" | "inches"; weight?: {value: number; unit?: "kg" | "lbs"}}};
  customerReviews?: {rating?: number; totalReviews: number; reviews?: Array<{reviewerName: string; reviewText: string; reviewRating: number}>};
  technical?: {powerSupply?: "Single Phase 240V" | "Three Phase 400V"; operationType?: "Single Split / Inverter" | "Multi Split / Inverter"; outdoorUnitNoiseDb: number; coolingOperatingRange?: {minTemperature: string; maxTemperature: string}; heatingOperatingRange?: {minTemperature: string; maxTemperature: string}; refrigerantType?: "R32" | "R410A" | "R22"};
  shipping?: {dimensions?: {indoorUnit?: {width: number; height: number; depth: number; unit?: "mm" | "inches"; weight?: {value: number; unit?: "kg" | "lbs"}}; outdoorUnit?: {width: number; height: number; depth: number; weight?: {value: number; unit?: "kg" | "lbs"}; unit?: "mm" | "inches"}}; shippingCost: string; shippingTime: string};
  tags?: any;
  similarProducts?: string;
}
