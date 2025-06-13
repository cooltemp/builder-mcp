# Usage Examples

Here are practical examples of how to use the generated TypeScript interfaces in your frontend application.

## 🔧 Basic Usage

### Importing Types

```typescript
// Import specific model types
import type { HvacUnitContent, HvacUnitData } from '@/types/generated/hvac-unit';
import type { BlogPostContent } from '@/types/generated/blog-post';

// Import multiple types from index
import type { 
  HvacUnitContent, 
  BlogPostContent, 
  AuthorContent,
  BuilderReference 
} from '@/types/generated';
```

### Fetching Content

```typescript
// Fetch HVAC units with proper typing
async function getHvacUnits(): Promise<HvacUnitContent[]> {
  const response = await fetch('/api/content/hvac-unit');
  const data = await response.json();
  return data.results; // Properly typed as HvacUnitContent[]
}

// Fetch specific HVAC unit
async function getHvacUnit(id: string): Promise<HvacUnitContent | null> {
  const response = await fetch(`/api/content/hvac-unit/${id}`);
  const data = await response.json();
  return data.success ? data.data : null;
}
```

### Working with Content Data

```typescript
function displayHvacUnit(unit: HvacUnitContent) {
  // Access top-level properties
  console.log('Unit ID:', unit.id);
  console.log('Unit Name:', unit.name);
  console.log('Published:', unit.published);
  
  // Access nested data with full type safety
  const data = unit.data;
  console.log('SKU:', data.sku);
  console.log('Model:', data.model);
  
  // Handle optional properties safely
  if (data.price) {
    console.log('Price:', data.price.originalPrice, data.price.currency);
  }
  
  // Work with complex nested objects
  if (data.powerCapacity) {
    console.log('Cooling:', data.powerCapacity.coolingKw, 'kW');
    console.log('Heating:', data.powerCapacity.heatingKw, 'kW');
  }
}
```

### Handling References

```typescript
// References are typed as BuilderReference
function getReferencedModel(unit: HvacUnitContent) {
  if (unit.data.series) {
    const seriesRef = unit.data.series; // Type: BuilderReference
    console.log('Series ID:', seriesRef.id);
    console.log('Series Model:', seriesRef.model);
    console.log('Reference Type:', seriesRef['@type']);
  }
}

// Fetch referenced content
async function getSeriesForUnit(unit: HvacUnitContent) {
  if (unit.data.series) {
    const seriesId = unit.data.series.id;
    const series = await fetch(`/api/content/hvac-unit-series/${seriesId}`);
    return series.json();
  }
  return null;
}
```

## 🎯 React/Qwik Component Examples

### React Component

```typescript
import type { HvacUnitContent } from '@/types/generated';

interface HvacUnitCardProps {
  unit: HvacUnitContent;
}

export function HvacUnitCard({ unit }: HvacUnitCardProps) {
  const { data } = unit;
  
  return (
    <div className="hvac-unit-card">
      <h3>{data.model}</h3>
      <p>SKU: {data.sku}</p>
      
      {data.price && (
        <div className="price">
          {data.price.originalPrice} {data.price.currency}
          {data.price.isTaxIncluded && <span> (incl. tax)</span>}
        </div>
      )}
      
      {data.powerCapacity && (
        <div className="specs">
          <span>Cooling: {data.powerCapacity.coolingKw}kW</span>
          <span>Heating: {data.powerCapacity.heatingKw}kW</span>
        </div>
      )}
      
      <div className="stock-status">
        Status: {data.stock || 'Unknown'}
      </div>
    </div>
  );
}
```

### Qwik Component

```typescript
import { component$ } from '@builder.io/qwik';
import type { HvacUnitContent } from '@/types/generated';

interface HvacUnitCardProps {
  unit: HvacUnitContent;
}

export const HvacUnitCard = component$<HvacUnitCardProps>(({ unit }) => {
  const { data } = unit;
  
  return (
    <div class="hvac-unit-card">
      <h3>{data.model}</h3>
      <p>SKU: {data.sku}</p>
      
      {data.price && (
        <div class="price">
          {data.price.originalPrice} {data.price.currency}
          {data.price.isTaxIncluded && <span> (incl. tax)</span>}
        </div>
      )}
      
      {data.powerCapacity && (
        <div class="specs">
          <span>Cooling: {data.powerCapacity.coolingKw}kW</span>
          <span>Heating: {data.powerCapacity.heatingKw}kW</span>
        </div>
      )}
    </div>
  );
});
```

## 🔄 Creating/Updating Content

```typescript
import type { HvacUnitData } from '@/types/generated';

// Create new HVAC unit data
const newUnitData: HvacUnitData = {
  sku: "MSZ-AP60VGKD2",
  model: "Plus AP60 High Wall Heat Pump",
  series: {
    "@type": "@builder.io/core:Reference",
    id: "ac6cd7cd211d4d28acc33efd9d9e0ecc",
    model: "hvac-unit-series"
  },
  price: {
    originalPrice: 2803.9,
    currency: "NZD",
    isTaxIncluded: true
  },
  stock: "In Stock"
};

// Post to API
async function createHvacUnit(data: HvacUnitData, name: string) {
  const response = await fetch('/api/content/hvac-unit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, name })
  });
  
  return response.json() as Promise<{ success: boolean; data: HvacUnitContent }>;
}
```

## 🎨 Type Guards

```typescript
import type { HvacUnitContent, BlogPostContent } from '@/types/generated';

// Type guard to check if content is an HVAC unit
function isHvacUnit(content: any): content is HvacUnitContent {
  return content && 
         typeof content.id === 'string' && 
         content.data && 
         typeof content.data.sku === 'string';
}

// Use in your code
function processContent(content: unknown) {
  if (isHvacUnit(content)) {
    // TypeScript knows this is HvacUnitContent
    console.log('Processing HVAC unit:', content.data.sku);
  }
}
```
