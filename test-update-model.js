#!/usr/bin/env node

// Test script to test model update functionality
const { BuilderAdminService } = require('./dist/services/builderAdmin.js');
require('dotenv').config();

async function testUpdateModel() {
  console.log('🔍 Testing model update...\n');

  const config = {
    apiKey: process.env.BUILDER_API_KEY,
    privateKey: process.env.BUILDER_PRIVATE_KEY
  };

  const adminService = new BuilderAdminService(config);

  try {
    // First create a test model
    console.log('1️⃣ Creating test model...');
    const testModelName = `update-test-${Date.now()}`;
    const newModel = {
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

    const createResult = await adminService.createModel(newModel);
    
    if (!createResult.success) {
      console.error('❌ Failed to create test model:', createResult.error);
      return;
    }

    console.log('✅ Created test model:', createResult.data?.id);
    const modelId = createResult.data?.id;

    // Now try to update it
    console.log('\n2️⃣ Updating model with description field...');
    const updates = {
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
        },
        {
          name: 'description',
          type: 'text',
          required: false,
          helperText: 'A brief description of the content'
        }
      ]
    };

    const updateResult = await adminService.updateModel(modelId, updates);
    
    if (updateResult.success) {
      console.log('✅ Update successful!');
      console.log('Updated fields:', updateResult.data?.fields?.length);
      console.log('Fields:', updateResult.data?.fields?.map(f => f.name));
    } else {
      console.log('❌ Update failed:', updateResult.error);
      console.log('Status:', updateResult.status);
    }

    // Clean up
    console.log('\n3️⃣ Cleaning up...');
    const deleteResult = await adminService.deleteModel(modelId);
    if (deleteResult.success) {
      console.log('✅ Cleanup successful');
    } else {
      console.log('⚠️  Cleanup failed:', deleteResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUpdateModel();
