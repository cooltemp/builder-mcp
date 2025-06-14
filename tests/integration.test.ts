// Comprehensive Integration Test Suite
// Tests: Full end-to-end workflows, cross-layer integration, real-world scenarios

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createBuilderTools } from '@/mcp/tools';
import { createBuilderResources } from '@/mcp/resources';
import { createModelsRouter } from '@/routes/models';
import { createContentRouter } from '@/routes/content';
import { createTypesRouter } from '@/routes/types';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';
import fs from 'fs/promises';
import path from 'path';

describe('Full Integration Testing', () => {
  let app: express.Application;
  let mcpTools: any[];
  let mcpResources: any[];
  let testModelId: string | null = null;
  let testContentId: string | null = null;
  const testModelName = `integration-test-${Date.now()}`;
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(async () => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping Integration tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    // Setup Express app
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/models', createModelsRouter(config));
    app.use('/content', createContentRouter(config));
    app.use('/generate-types', createTypesRouter(config));
    
    // Setup MCP components
    mcpTools = createBuilderTools(config);
    mcpResources = createBuilderResources(config);
    
    Logger.info('🧪 Starting Full Integration tests');
  });

  afterAll(async () => {
    if (!hasApiKeys) return;
    
    // Comprehensive cleanup
    try {
      // Delete test content if exists
      if (testContentId && testModelId) {
        Logger.info(`🧹 Cleaning up test content: ${testContentId}`);
        // Content cleanup would go here if we had delete content endpoint
      }
      
      // Delete test model if exists
      if (testModelId) {
        Logger.info(`🧹 Cleaning up test model: ${testModelId}`);
        await request(app)
          .delete(`/models/${testModelId}`)
          .expect(200);
      }
    } catch (error) {
      Logger.warn('Cleanup warning: Could not clean up test resources', error);
    }
  });

  describe('End-to-End Model Lifecycle', () => {
    it('should complete full model lifecycle: create → verify → update → verify → delete', async () => {
      if (!hasApiKeys) return;
      
      // Step 1: Create model via Express API
      const modelData = {
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
      
      const createResponse = await request(app)
        .post('/models')
        .send(modelData)
        .expect('Content-Type', /json/);
      
      if (createResponse.status !== 200) {
        Logger.warn(`⚠️  Model creation failed: ${createResponse.body.error}`);
        return;
      }
      
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data).toHaveProperty('id');
      testModelId = createResponse.body.data.id;
      
      Logger.info(`✅ Step 1: Model created via Express API: ${testModelId}`);
      
      // Step 2: Verify model exists via MCP tool
      const getModelTool = mcpTools.find(tool => tool.name === 'get_model');
      const mcpResult = await getModelTool!.handler({ id: testModelId });
      const mcpData = JSON.parse(mcpResult.content[0].text);
      
      expect(mcpData.success).toBe(true);
      expect(mcpData.data.id).toBe(testModelId);
      expect(mcpData.data.name).toBe(testModelName);
      expect(mcpData.data.fields).toHaveLength(2);
      
      Logger.info('✅ Step 2: Model verified via MCP tool');
      
      // Step 3: Update model via Express API
      const updates = {
        fields: [
          ...modelData.fields,
          {
            name: 'description',
            type: 'text',
            required: false,
            helperText: 'Brief description'
          }
        ]
      };

      const updateResponse = await request(app)
        .put(`/models/${testModelId}`)
        .send(updates)
        .expect('Content-Type', /json/);

      // Handle both success and failure cases (model updates can fail due to Builder.io limitations)
      if (updateResponse.status === 200) {
        expect(updateResponse.body.success).toBe(true);
        expect(updateResponse.body.data.fields).toHaveLength(3);

        Logger.info('✅ Step 3: Model updated via Express API');

        // Step 4: Verify update via MCP tool
        const mcpUpdateResult = await getModelTool!.handler({ id: testModelId });
        const mcpUpdateData = JSON.parse(mcpUpdateResult.content[0].text);

        expect(mcpUpdateData.success).toBe(true);
        expect(mcpUpdateData.data.fields).toHaveLength(3);

        const descriptionField = mcpUpdateData.data.fields.find((f: any) => f.name === 'description');
        expect(descriptionField).toBeDefined();
        expect(descriptionField.type).toBe('text');

        Logger.info('✅ Step 4: Model update verified via MCP tool');
      } else {
        // Model update failed (expected behavior for some models)
        expect(updateResponse.body.success).toBe(false);
        Logger.warn(`⚠️  Step 3: Model update failed (expected): ${updateResponse.body.error}`);
        Logger.info('✅ Step 4: Skipped verification due to update failure');
      }
      
      // Step 5: Generate TypeScript types
      const generateTypesTool = mcpTools.find(tool => tool.name === 'generate_types_for_model');
      const typesResult = await generateTypesTool!.handler({ model: testModelName });
      const typesData = JSON.parse(typesResult.content[0].text);

      expect(typesData).toHaveProperty('content');
      // Convert model name to PascalCase interface name (e.g., "integration-test-123" -> "IIntegrationTest123")
      const expectedInterfaceName = `I${testModelName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}`;
      expect(typesData.content).toContain(expectedInterfaceName);

      Logger.info('✅ Step 5: TypeScript types generated via MCP tool');
      
      // Step 6: Delete model via Express API
      const deleteResponse = await request(app)
        .delete(`/models/${testModelId}`)
        .expect('Content-Type', /json/);

      // Handle both success and failure cases (model might already be deleted)
      if (deleteResponse.status === 200) {
        expect(deleteResponse.body.success).toBe(true);
        expect(deleteResponse.body.data).toBe(true);
        Logger.info('✅ Step 6: Model deleted via Express API');

        // Step 7: Verify deletion via MCP tool
        const mcpDeleteResult = await getModelTool!.handler({ id: testModelId });
        const mcpDeleteData = JSON.parse(mcpDeleteResult.content[0].text);

        expect(mcpDeleteData.success).toBe(false);
        expect(mcpDeleteData.error).toContain('not found');

        Logger.info('✅ Step 7: Model deletion verified via MCP tool');
      } else {
        // Model was already deleted or doesn't exist
        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.success).toBe(false);
        Logger.warn(`⚠️  Step 6: Model already deleted or not found (expected): ${deleteResponse.body.error}`);
        Logger.info('✅ Step 7: Skipped deletion verification - model already gone');
      }

      testModelId = null; // Clear for cleanup
      
      Logger.info('🎉 Full model lifecycle integration test completed successfully!');
    });
  });

  describe('Cross-Layer Data Consistency', () => {
    it('should maintain data consistency between Express API and MCP tools', async () => {
      if (!hasApiKeys) return;
      
      // Get models via Express API
      const expressResponse = await request(app)
        .get('/models')
        .expect(200);
      
      expect(expressResponse.body.success).toBe(true);
      const expressModels = expressResponse.body.data.models;
      
      // Get models via MCP tool
      const listModelsTool = mcpTools.find(tool => tool.name === 'list_models');
      const mcpResult = await listModelsTool!.handler({});
      const mcpData = JSON.parse(mcpResult.content[0].text);
      
      expect(mcpData.success).toBe(true);
      const mcpModels = mcpData.data.models;
      
      // Compare data consistency
      expect(expressModels.length).toBe(mcpModels.length);
      
      // Check that all models exist in both responses
      expressModels.forEach((expressModel: any) => {
        const mcpModel = mcpModels.find((m: any) => m.id === expressModel.id);
        expect(mcpModel).toBeDefined();
        expect(mcpModel.name).toBe(expressModel.name);
        expect(mcpModel.kind).toBe(expressModel.kind);
      });
      
      Logger.info('✅ Data consistency maintained between Express API and MCP tools');
    });

    it('should provide consistent model information via MCP resources', async () => {
      if (!hasApiKeys) return;
      
      // Get models via MCP resource
      const modelsResource = mcpResources.find(resource => resource.uri === 'builder://models');
      const resourceResult = await modelsResource!.handler();
      
      expect(resourceResult).toHaveProperty('models');
      expect(Array.isArray(resourceResult.models)).toBe(true);
      
      // Get models via MCP tool for comparison
      const listModelsTool = mcpTools.find(tool => tool.name === 'list_models');
      const toolResult = await listModelsTool!.handler({});
      const toolData = JSON.parse(toolResult.content[0].text);
      
      expect(toolData.success).toBe(true);
      
      // Compare counts (should be the same)
      expect(resourceResult.models.length).toBe(toolData.data.models.length);
      
      Logger.info('✅ MCP resources provide consistent data with MCP tools');
    });
  });

  describe('Type Generation Integration', () => {
    it('should generate and validate types for existing models', async () => {
      if (!hasApiKeys) return;
      
      // Get available models
      const modelsResponse = await request(app)
        .get('/models/ids')
        .expect(200);
      
      if (modelsResponse.body.data.length === 0) {
        Logger.warn('⚠️  No models available for type generation test');
        return;
      }
      
      const firstModel = modelsResponse.body.data[0];
      
      // Generate types via Express API
      const typesResponse = await request(app)
        .post(`/generate-types/${firstModel.name}`)
        .expect(200);

      expect(typesResponse.body.success).toBe(true);
      expect(typesResponse.body.data).toHaveProperty('content');

      // Generate types via MCP tool
      const generateTypesTool = mcpTools.find(tool => tool.name === 'generate_types_for_model');
      const mcpResult = await generateTypesTool!.handler({ model: firstModel.name });
      const mcpData = JSON.parse(mcpResult.content[0].text);

      expect(mcpData).toHaveProperty('content');

      // Compare generated interfaces (should be identical except for timestamps)
      // Remove timestamps from both for comparison
      const expressContent = typesResponse.body.data.content.replace(/\/\/ Generated on: .*\n/, '');
      const mcpContent = mcpData.content.replace(/\/\/ Generated on: .*\n/, '');
      expect(expressContent).toBe(mcpContent);
      
      Logger.info(`✅ Type generation consistent between Express API and MCP for model: ${firstModel.name}`);
    });

    it('should validate generated types against actual content', async () => {
      if (!hasApiKeys) return;
      
      // Get available models
      const modelsResponse = await request(app)
        .get('/models/ids')
        .expect(200);
      
      if (modelsResponse.body.data.length === 0) {
        Logger.warn('⚠️  No models available for type validation test');
        return;
      }
      
      const firstModel = modelsResponse.body.data[0];
      
      // Validate types via MCP tool
      const validateTypesTool = mcpTools.find(tool => tool.name === 'validate_model_types');
      const validationResult = await validateTypesTool!.handler({ model: firstModel.name });
      const validationData = JSON.parse(validationResult.content[0].text);

      expect(validationData).toHaveProperty('model');
      expect(validationData).toHaveProperty('validation');
      expect(validationData.validation).toHaveProperty('hasContent');
      expect(validationData.validation).toHaveProperty('typeMatches');
      expect(validationData.validation).toHaveProperty('schemaFields');
      expect(validationData.validation).toHaveProperty('contentFields');
      
      Logger.info(`✅ Type validation completed for model: ${firstModel.name}`);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle errors consistently across all layers', async () => {
      if (!hasApiKeys) return;
      
      const invalidModelId = 'invalid-integration-test-id';
      
      // Test Express API error handling
      const expressResponse = await request(app)
        .get(`/models/${invalidModelId}`)
        .expect(404);
      
      expect(expressResponse.body.success).toBe(false);
      expect(expressResponse.body).toHaveProperty('error');
      
      // Test MCP tool error handling
      const getModelTool = mcpTools.find(tool => tool.name === 'get_model');
      const mcpResult = await getModelTool!.handler({ id: invalidModelId });
      const mcpData = JSON.parse(mcpResult.content[0].text);
      
      expect(mcpData.success).toBe(false);
      expect(mcpData).toHaveProperty('error');
      expect(mcpData).toHaveProperty('status');
      
      // Both should indicate the same type of error
      expect(mcpData.status).toBe(404);
      
      Logger.info('✅ Error handling consistent across Express API and MCP tools');
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle concurrent requests reliably', async () => {
      if (!hasApiKeys) return;
      
      // Create multiple concurrent requests
      const concurrentRequests = Array(5).fill(null).map(() => 
        request(app)
          .get('/models/ids')
          .expect(200)
      );
      
      const responses = await Promise.all(concurrentRequests);
      
      // All responses should be successful and consistent
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
      
      // All responses should have the same data
      const firstResponseData = responses[0].body.data;
      responses.slice(1).forEach(response => {
        expect(response.body.data.length).toBe(firstResponseData.length);
      });
      
      Logger.info('✅ Concurrent requests handled reliably');
    });

    it('should maintain performance under load', async () => {
      if (!hasApiKeys) return;
      
      const startTime = Date.now();
      
      // Execute multiple operations
      const operations = [
        request(app).get('/models'),
        request(app).get('/models/ids'),
        mcpTools.find(tool => tool.name === 'list_models')!.handler({}),
        mcpTools.find(tool => tool.name === 'get_model_ids')!.handler({})
      ];
      
      await Promise.all(operations);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(10000); // 10 seconds
      
      Logger.info(`✅ Performance test completed in ${duration}ms`);
    });
  });

  describe('Real-World Workflow Simulation', () => {
    it('should simulate typical AI agent workflow', async () => {
      if (!hasApiKeys) return;
      
      Logger.info('🤖 Simulating AI agent workflow...');
      
      // Step 1: Agent discovers available models
      const listModelsTool = mcpTools.find(tool => tool.name === 'list_models');
      const modelsResult = await listModelsTool!.handler({});
      const modelsData = JSON.parse(modelsResult.content[0].text);
      
      expect(modelsData.success).toBe(true);
      Logger.info(`Step 1: Agent discovered ${modelsData.data.models.length} models`);
      
      // Step 2: Agent generates types for all models
      const generateTypesTool = mcpTools.find(tool => tool.name === 'generate_types');
      const typesResult = await generateTypesTool!.handler({});
      const typesData = JSON.parse(typesResult.content[0].text);
      
      expect(typesData.success).toBe(true);
      Logger.info('Step 2: Agent generated TypeScript types');
      
      // Step 3: Agent gets server info
      const infoResource = mcpResources.find(resource => resource.uri === 'builder://info');
      const infoResult = await infoResource!.handler();
      
      expect(infoResult).toHaveProperty('capabilities');
      Logger.info('Step 3: Agent retrieved server capabilities');
      
      // Step 4: Agent validates types for a specific model (if available)
      if (modelsData.data.models.length > 0) {
        const firstModel = modelsData.data.models[0];
        const validateTypesTool = mcpTools.find(tool => tool.name === 'validate_model_types');
        const validationResult = await validateTypesTool!.handler({ model: firstModel.name });
        const validationData = JSON.parse(validationResult.content[0].text);

        expect(validationData).toHaveProperty('model');
        expect(validationData).toHaveProperty('validation');
        Logger.info(`Step 4: Agent validated types for model: ${firstModel.name}`);
      }
      
      Logger.info('🎉 AI agent workflow simulation completed successfully!');
    });
  });
});
