#!/usr/bin/env node

// Test script to directly test the MCP create_model tool
const { createBuilderTools } = require('./dist/mcp/tools.js');
require('dotenv').config();

// Enable debug mode
process.env.DEBUG_MCP = 'true';

async function testMcpCreateModel() {
  console.log('🔍 Testing MCP create_model tool...\n');

  // Validate configuration
  const apiKey = process.env.BUILDER_API_KEY;
  const privateKey = process.env.BUILDER_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    console.error('❌ Missing required environment variables');
    console.error('Required: BUILDER_API_KEY, BUILDER_PRIVATE_KEY');
    process.exit(1);
  }

  const config = {
    apiKey,
    privateKey
  };

  try {
    // Create the MCP tools
    const tools = createBuilderTools(config);
    
    // Find the create_model tool
    const createModelTool = tools.find(tool => tool.name === 'create_model');
    
    if (!createModelTool) {
      console.error('❌ create_model tool not found');
      process.exit(1);
    }

    console.log('✅ Found create_model tool');
    console.log('Tool description:', createModelTool.description);
    console.log('Tool schema:', JSON.stringify(createModelTool.inputSchema, null, 2));

    // Test data (same as in the passing tests)
    const testModelName = `mcp-test-model-${Date.now()}`;
    const testData = {
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

    console.log('\n📝 Test data:');
    console.log(JSON.stringify(testData, null, 2));

    console.log('\n🚀 Calling create_model tool...');
    
    // Call the tool handler directly
    const result = await createModelTool.handler(testData);
    
    console.log('\n📋 Result:');
    console.log(JSON.stringify(result, null, 2));

    // Parse the result to check if it was successful
    const resultText = result.content[0].text;
    const parsedResult = JSON.parse(resultText);
    
    if (parsedResult.success) {
      console.log('\n✅ Model creation successful!');
      console.log('Model ID:', parsedResult.data?.id);
      
      // Clean up - try to delete the test model
      const deleteModelTool = tools.find(tool => tool.name === 'delete_model');
      if (deleteModelTool && parsedResult.data?.id) {
        console.log('\n🧹 Cleaning up test model...');
        const deleteResult = await deleteModelTool.handler({ id: parsedResult.data.id });
        console.log('Delete result:', JSON.stringify(deleteResult, null, 2));
      }
    } else {
      console.log('\n❌ Model creation failed!');
      console.log('Error:', parsedResult.error);
      console.log('Status:', parsedResult.status);
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    console.error('Stack:', error.stack);
  }

  // Check if debug log was created
  const fs = require('fs');
  const path = require('path');
  const logFile = path.join(process.cwd(), 'mcp-debug.log');
  
  if (fs.existsSync(logFile)) {
    console.log('\n📋 Debug log created at:', logFile);
    console.log('Log contents:');
    console.log(fs.readFileSync(logFile, 'utf8'));
  } else {
    console.log('\n⚠️  No debug log found');
  }
}

// Run the test
testMcpCreateModel().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
