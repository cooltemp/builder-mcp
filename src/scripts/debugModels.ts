#!/usr/bin/env tsx

// Debug script to inspect actual Builder.io model data structure
// Usage: npm run debug-models [model-name]

import { config } from 'dotenv';
import { BuilderAdminService } from '@/services/builderAdmin';
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
    process.exit(1);
  }

  const builderConfig: BuilderConfig = {
    apiKey,
    privateKey
  };

  const adminService = new BuilderAdminService(builderConfig);

  try {
    if (specificModel) {
      // Debug specific model
      console.log(`🔍 Debugging model: ${specificModel}`);
      
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

      console.log('\n📋 Model Data Structure:');
      console.log(JSON.stringify(modelData, null, 2));
      
      if (modelData.fields) {
        console.log('\n🔧 Fields Structure:');
        console.log('Type of fields:', typeof modelData.fields);
        console.log('Is Array:', Array.isArray(modelData.fields));
        console.log('Fields:', JSON.stringify(modelData.fields, null, 2));
      }
    } else {
      // Debug all models
      console.log('🔍 Debugging all models...');
      
      const modelsResult = await adminService.getModels();
      
      if (!modelsResult.success) {
        console.error('❌ Failed to fetch models:', modelsResult.error);
        process.exit(1);
      }

      const models = modelsResult.data?.models || [];
      console.log(`📋 Found ${models.length} models\n`);

      for (const model of models.slice(0, 3)) { // Only show first 3 models to avoid spam
        console.log(`\n🏷️  Model: ${model.name}`);
        console.log('   ID:', model.id);
        console.log('   Kind:', model.kind);
        console.log('   Fields type:', typeof model.fields);
        console.log('   Fields is array:', Array.isArray(model.fields));
        
        if (model.fields) {
          console.log('   Fields structure:');
          if (Array.isArray(model.fields)) {
            console.log(`     Array with ${model.fields.length} items`);
            if (model.fields.length > 0) {
              console.log('     First field:', JSON.stringify(model.fields[0], null, 6));
            }
          } else {
            console.log('     Raw fields data:', JSON.stringify(model.fields, null, 6));
          }
        }
        console.log('   ---');
      }

      if (models.length > 3) {
        console.log(`\n... and ${models.length - 3} more models`);
      }
    }
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    Logger.error('CLI debug error:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
