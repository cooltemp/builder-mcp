#!/usr/bin/env ts-node

// Debug script to test model creation directly
import dotenv from 'dotenv';
import { BuilderAdminService } from './src/services/builderAdmin';
import { BuilderConfig, BuilderModel } from './src/types';
import { Logger } from './src/utils/logger';

// Load environment variables
dotenv.config();

// Enable debug mode
process.env.DEBUG_MCP = 'true';

async function testModelCreation() {
  console.log('🔍 Testing Builder.io model creation...\n');

  // Validate configuration
  const apiKey = process.env.BUILDER_API_KEY;
  const privateKey = process.env.BUILDER_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    console.error('❌ Missing required environment variables');
    console.error('Required: BUILDER_API_KEY, BUILDER_PRIVATE_KEY');
    process.exit(1);
  }

  const config: BuilderConfig = {
    apiKey,
    privateKey
  };

  const adminService = new BuilderAdminService(config);

  // Test 1: Check if we can list models
  console.log('1️⃣ Testing model listing...');
  const modelsResult = await adminService.getModels();
  
  if (modelsResult.success) {
    console.log(`✅ Successfully fetched ${modelsResult.data?.models.length || 0} models`);
  } else {
    console.log(`❌ Failed to fetch models: ${modelsResult.error}`);
    return;
  }

  // Test 2: Try to introspect the schema
  console.log('\n2️⃣ Testing schema introspection...');
  const schemaResult = await adminService.introspectSchema();
  
  if (schemaResult.success) {
    console.log('✅ Schema introspection successful');
    
    // Look for createModel mutation and ModelInput type
    const types = schemaResult.data?.__schema?.types || [];
    const modelInputType = types.find((type: any) => type.name === 'ModelInput');
    const mutationType = types.find((type: any) => type.name === 'Mutation');
    
    if (modelInputType) {
      console.log('✅ Found ModelInput type in schema');
      console.log('ModelInput fields:', modelInputType.fields?.map((f: any) => f.name) || 'No fields found');
    } else {
      console.log('⚠️  ModelInput type not found in schema');
    }
    
    if (mutationType) {
      const createModelField = mutationType.fields?.find((f: any) => f.name === 'createModel');
      if (createModelField) {
        console.log('✅ Found createModel mutation in schema');
      } else {
        console.log('⚠️  createModel mutation not found in schema');
      }
    }
  } else {
    console.log(`❌ Schema introspection failed: ${schemaResult.error}`);
  }

  // Test 3: Try to create a simple model (same as in tests)
  console.log('\n3️⃣ Testing model creation...');
  
  const testModelName = `test-model-${Date.now()}`;
  const newModel: Partial<BuilderModel> = {
    name: testModelName,
    kind: 'data',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'content',
        type: 'longText',
        required: false
      }
    ]
  };

  console.log('Model data to create:', JSON.stringify(newModel, null, 2));
  
  const createResult = await adminService.createModel(newModel);
  
  if (createResult.success) {
    console.log(`✅ Successfully created model: ${createResult.data?.id}`);
    console.log('Created model data:', JSON.stringify(createResult.data, null, 2));
    
    // Clean up - delete the test model
    console.log('\n4️⃣ Cleaning up test model...');
    const deleteResult = await adminService.deleteModel(createResult.data?.id || '');
    if (deleteResult.success) {
      console.log('✅ Successfully deleted test model');
    } else {
      console.log(`⚠️  Failed to delete test model: ${deleteResult.error}`);
    }
  } else {
    console.log(`❌ Model creation failed: ${createResult.error}`);
    console.log('Status:', createResult.status);
    console.log('Full error response:', JSON.stringify(createResult, null, 2));
  }

  console.log('\n📋 Debug log written to mcp-debug.log');
}

// Run the test
testModelCreation().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
