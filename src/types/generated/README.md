# Generated TypeScript Interfaces

This directory contains auto-generated TypeScript interfaces for Builder.io **content data** (not model schemas). These interfaces match the actual structure returned by the Builder.io Content API.

## 🚀 Quick Start

### Generate All Content Interfaces
```bash
npm run generate-types
```

### Generate Specific Model Interface
```bash
npm run generate-types model-name
```

### Debug Model Structure
```bash
npm run debug-models [model-name]
```

## 📁 File Structure

- **Individual model files**: `{model-name}.ts` - Content interfaces per model
- **Index file**: `index.ts` - Exports all interfaces for easy importing

## 🔧 Usage

```typescript
// Import specific content interfaces
import type { HvacUnitContent, HvacUnitData } from '@/types/generated/hvac-unit';

// Import all interfaces
import type { HvacUnitContent, BlogPostContent, AuthorContent } from '@/types/generated';

// Use in your frontend code
const hvacUnit: HvacUnitContent = {
  id: "b8b662daad3a454aad1b82d48339052d",
  name: "AP60",
  published: "published",
  createdDate: 1743288329586,
  modelId: "442c1b28773c4e149a70ba26a4834f62",
  data: {
    name: "AP60",
    sku: "MSZ-AP60VGKD2",
    model: "Plus AP60 High Wall Heat Pump",
    useCase: {
      "@type": "@builder.io/core:Reference",
      id: "7837ea59cd8041c5a4ef3b23f4f812e4",
      model: "hvac-use-case"
    },
    // ... rest of your data
  }
};
```

## ✨ Features

- **Content-focused**: Interfaces match actual Content API responses
- **Reference handling**: `BuilderReference` type for linked content
- **Proper enum handling**: Cleans malformed enum values
- **Nested structures**: Supports complex objects and arrays
- **Required vs Optional**: Correctly maps field requirements
- **Date handling**: Dates are typed as strings (ISO format from API)
- **Error resilience**: Graceful handling of malformed field definitions

## 📋 Interface Types

Each model generates two interfaces:

- **`{Model}Content`**: Full content entry structure (includes id, name, published, etc.)
- **`{Model}Data`**: Just the data payload (nested under `data` property)

## 🔗 References

Builder.io references are typed as `BuilderReference`:

```typescript
interface BuilderReference {
  '@type': '@builder.io/core:Reference';
  id: string;
  model: string;
}
```

## 🔄 Regeneration

The interfaces are automatically regenerated when you run the generation scripts. The system:

1. Fetches current model schemas from Builder.io Admin API
2. Processes field definitions with proper type mapping
3. Generates clean TypeScript interfaces
4. Creates separate files for better organization
5. Updates the index file for easy imports

## 🛠️ Troubleshooting

If generation fails:

1. Check your `.env` file has valid Builder.io credentials
2. Verify network connectivity to Builder.io APIs
3. Run `npm run debug-models` to inspect raw model data
4. Check the console for specific error messages

## 📝 Notes

- Built-in Builder.io fields (id, name, published, etc.) are automatically included
- Custom fields with the same names as built-ins take precedence
- Malformed enum values are automatically cleaned
- Complex nested structures are properly typed
- Reference fields default to string type if model is not specified
