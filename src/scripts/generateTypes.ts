#!/usr/bin/env tsx

// CLI script to generate TypeScript interfaces from Builder.io models
// Usage: npm run generate-types [model-name]

import { config } from 'dotenv';
import { BuilderAdminService } from '@/services/builderAdmin';
import { TypeGenerator } from '@/services/typeGenerator';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';

// Load environment variables
config();

async function main() {
  const args = process.argv.slice(2);
  const specificModel = args[0];

  // Validate environment variables
  const apiKey = process.env.BUILDER_API_KEY;
  const privateKey = process.env.BUILDER_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   BUILDER_API_KEY and BUILDER_PRIVATE_KEY must be set');
    console.error('   Copy .env.example to .env and fill in your Builder.io credentials');
    process.exit(1);
  }

  const builderConfig: BuilderConfig = {
    apiKey,
    privateKey
  };

  const adminService = new BuilderAdminService(builderConfig);
  const typeGenerator = new TypeGenerator(undefined, true); // Enable interface prefix

  try {
    if (specificModel) {
      // Generate interface for specific model
      console.log(`🔄 Generating TypeScript interface for model: ${specificModel}`);
      
      const modelResult = await adminService.getModel(specificModel);
      
      if (!modelResult.success) {
        console.error(`❌ Failed to fetch model ${specificModel}:`, modelResult.error);
        process.exit(1);
      }

      const modelData = modelResult.data;
      if (!modelData) {
        console.error(`❌ Model ${specificModel} not found`);
        process.exit(1);
      }

      // For single model generation, we need to fetch all models to build the mapping
      const allModelsResult = await adminService.getModels();
      if (allModelsResult.success && allModelsResult.data?.models) {
        typeGenerator.setModelMapping(allModelsResult.data.models);
      }

      const generatedInterface = typeGenerator.generateInterface(modelData);
      await typeGenerator.writeInterface(generatedInterface);

      console.log(`✅ Generated interface for ${specificModel}:`);
      console.log(`   📁 ${generatedInterface.filePath}`);
      console.log(`   🏷️  ${generatedInterface.name}, ${generatedInterface.name}Data`);
    } else {
      // Generate interfaces for all models
      console.log('🔄 Fetching all Builder.io models...');
      
      const modelsResult = await adminService.getModels();
      
      if (!modelsResult.success) {
        console.error('❌ Failed to fetch models:', modelsResult.error);
        process.exit(1);
      }

      const models = modelsResult.data?.models || [];
      console.log(`📋 Found ${models.length} models`);

      if (models.length === 0) {
        console.log('ℹ️  No models found in your Builder.io space');
        process.exit(0);
      }

      // Set up model ID to name mapping for reference resolution
      typeGenerator.setModelMapping(models);

      // Clean existing generated files
      console.log('🧹 Cleaning existing generated files...');
      await typeGenerator.cleanGeneratedDir();

      const generatedInterfaces = [];
      const errors = [];

      // Generate interface for each model
      console.log('🔄 Generating TypeScript interfaces...');
      for (const model of models) {
        try {
          const generatedInterface = typeGenerator.generateInterface(model);
          await typeGenerator.writeInterface(generatedInterface);
          generatedInterfaces.push(generatedInterface);
          console.log(`   ✅ ${model.name} → ${generatedInterface.name}`);
        } catch (error: any) {
          errors.push({ model: model.name, error: error.message });
          console.log(`   ❌ ${model.name} → Error: ${error.message}`);
        }
      }

      // Generate index file
      if (generatedInterfaces.length > 0) {
        console.log('📝 Generating index file...');
        const indexContent = typeGenerator.generateIndexFile(generatedInterfaces);
        await typeGenerator.writeIndexFile(indexContent);
      }

      // Summary
      console.log('\n📊 Generation Summary:');
      console.log(`   ✅ Successfully generated: ${generatedInterfaces.length} interfaces`);
      if (errors.length > 0) {
        console.log(`   ❌ Errors: ${errors.length}`);
        errors.forEach(({ model, error }) => {
          console.log(`      • ${model}: ${error}`);
        });
      }
      console.log(`   📁 Output directory: src/types/generated/`);
      console.log(`   📄 Index file: src/types/generated/index.ts`);

      if (generatedInterfaces.length > 0) {
        console.log('\n🎉 TypeScript interfaces generated successfully!');
        console.log('   Import them in your code:');
        console.log('   import type { ModelName, ModelNameData } from "@/types/generated";');
      }
    }
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    Logger.error('CLI generation error:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled promise rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}
