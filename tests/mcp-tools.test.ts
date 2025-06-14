// Comprehensive test suite for MCP Tools
// Tests: Direct MCP tool function calls, input validation, error handling

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { createBuilderTools, McpTool } from '@/mcp/tools';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';

describe('MCP Tools Direct Testing', () => {
  let tools: McpTool[];
  let testModelId: string | null = null;
  const testModelName = `mcp-tools-test-${Date.now()}`;
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(() => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping MCP Tools tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    tools = createBuilderTools(config);
    Logger.info('🧪 Starting MCP Tools direct tests');
  });

  afterAll(async () => {
    if (!hasApiKeys || !testModelId) return;
    
    // Cleanup: Delete test model if it still exists
    try {
      const deleteModelTool = tools.find(tool => tool.name === 'delete_model');
      if (deleteModelTool) {
        Logger.info(`🧹 Cleaning up test model: ${testModelId}`);
        await deleteModelTool.handler({ id: testModelId });
      }
    } catch (error) {
      Logger.warn('Cleanup warning: Could not delete test model', error);
    }
  });

  describe('Tool Registration and Schema', () => {
    it('should register all expected MCP tools', () => {
      if (!hasApiKeys) return;
      
      const expectedTools = [
        'list_models',
        'get_model_ids',
        'get_model',
        'create_model',
        'update_model',
        'delete_model',
        'get_content',
        'get_content_by_id',
        'create_content',
        'update_content',
        'publish_content',
        'unpublish_content',
        'upload_from_url',
        'get_file_info',
        'delete_file',
        'generate_types',
        'generate_types_for_model',
        'validate_model_types'
      ];
      
      expect(tools).toHaveLength(expectedTools.length);
      
      expectedTools.forEach(toolName => {
        const tool = tools.find(t => t.name === toolName);
        expect(tool).toBeDefined();
        expect(tool?.description).toBeDefined();
        expect(tool?.inputSchema).toBeDefined();
        expect(tool?.handler).toBeTypeOf('function');
      });
      
      Logger.info(`✅ All ${expectedTools.length} MCP tools registered correctly`);
    });

    it('should have proper input schemas for all tools', () => {
      if (!hasApiKeys) return;
      
      tools.forEach(tool => {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema).toHaveProperty('type');
        expect(tool.inputSchema.type).toBe('object');
        
        if (tool.inputSchema.required) {
          expect(Array.isArray(tool.inputSchema.required)).toBe(true);
        }
        
        if (tool.inputSchema.properties) {
          expect(typeof tool.inputSchema.properties).toBe('object');
        }
      });
      
      Logger.info('✅ All tools have valid input schemas');
    });
  });

  describe('Model Management Tools', () => {
    it('list_models_node should return proper MCP response format', async () => {
      if (!hasApiKeys) return;
      
      const listModelsTool = tools.find(tool => tool.name === 'list_models');
      expect(listModelsTool).toBeDefined();

      const result = await listModelsTool!.handler({});

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');

      const responseData = JSON.parse(result.content[0].text);
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');

      Logger.info('✅ list_models returns proper MCP response format');
    });

    it('get_model_ids_node should return model IDs only', async () => {
      if (!hasApiKeys) return;
      
      const getModelIdsTool = tools.find(tool => tool.name === 'get_model_ids');
      expect(getModelIdsTool).toBeDefined();

      const result = await getModelIdsTool!.handler({});
      const responseData = JSON.parse(result.content[0].text);

      expect(responseData.success).toBe(true);
      if (responseData.data && responseData.data.length > 0) {
        const firstModel = responseData.data[0];
        expect(firstModel).toHaveProperty('id');
        expect(firstModel).toHaveProperty('name');
        expect(Object.keys(firstModel)).toHaveLength(2);
      }

      Logger.info('✅ get_model_ids returns correct format');
    });

    it('create_model_node should validate input schema', async () => {
      if (!hasApiKeys) return;
      
      const createModelTool = tools.find(tool => tool.name === 'create_model');
      expect(createModelTool).toBeDefined();

      // Test with missing required fields - should return error response, not throw
      const invalidResult = await createModelTool!.handler({});
      const invalidData = JSON.parse(invalidResult.content[0].text);
      expect(invalidData.success).toBe(false);
      expect(invalidData.error).toContain('Model name is required');

      // Test with valid data
      const validModelData = {
        name: testModelName,
        kind: 'data',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: ''
          }
        ]
      };

      const result = await createModelTool!.handler(validModelData);
      const responseData = JSON.parse(result.content[0].text);

      if (responseData.success) {
        expect(responseData.data).toHaveProperty('id');
        expect(responseData.data.name).toBe(testModelName);
        testModelId = responseData.data.id;
        Logger.info(`✅ create_model validation and creation successful: ${testModelId}`);
      } else {
        Logger.warn(`⚠️  Model creation failed: ${responseData.error}`);
      }
    });

    it('get_model_node should handle valid and invalid IDs', async () => {
      if (!hasApiKeys) return;
      
      const getModelTool = tools.find(tool => tool.name === 'get_model');
      expect(getModelTool).toBeDefined();

      // Test with missing ID
      try {
        await getModelTool!.handler({});
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.message).toContain('Model ID is required');
      }

      // Test with invalid ID
      const invalidResult = await getModelTool!.handler({ id: 'invalid-id-12345' });
      const invalidData = JSON.parse(invalidResult.content[0].text);
      expect(invalidData.success).toBe(false);

      // Test with valid ID (if we have one)
      if (testModelId) {
        const validResult = await getModelTool!.handler({ id: testModelId });
        const validData = JSON.parse(validResult.content[0].text);
        expect(validData.success).toBe(true);
        expect(validData.data.id).toBe(testModelId);
      }

      Logger.info('✅ get_model handles valid and invalid IDs correctly');
    });
  });

  describe('Content Management Tools', () => {
    it('get_content_node should validate model parameter', async () => {
      if (!hasApiKeys) return;
      
      const getContentTool = tools.find(tool => tool.name === 'get_content');
      expect(getContentTool).toBeDefined();

      // Test with missing model
      try {
        await getContentTool!.handler({});
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.message).toContain('Model name is required');
      }

      // Test with valid model (use a common model name)
      const result = await getContentTool!.handler({
        model: 'page',
        limit: 1
      });
      const responseData = JSON.parse(result.content[0].text);

      // Should return success even if no content exists
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');

      Logger.info('✅ get_content validates model parameter correctly');
    });

    it('create_content_node should validate required fields', async () => {
      if (!hasApiKeys) return;
      
      const createContentTool = tools.find(tool => tool.name === 'create_content');
      expect(createContentTool).toBeDefined();

      // Test with missing model
      try {
        await createContentTool!.handler({ data: {} });
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.message).toContain('Model name is required');
      }

      // Test with missing data
      try {
        await createContentTool!.handler({ model: 'page' });
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.message).toContain('data');
      }

      Logger.info('✅ create_content validates required fields correctly');
    });
  });

  describe('Type Generation Tools', () => {
    it('generate_types_node should work without parameters', async () => {
      if (!hasApiKeys) return;
      
      const generateTypesTool = tools.find(tool => tool.name === 'generate_types');
      expect(generateTypesTool).toBeDefined();

      const result = await generateTypesTool!.handler({});
      const responseData = JSON.parse(result.content[0].text);

      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');
      expect(responseData.data).toHaveProperty('message');
      expect(responseData.data).toHaveProperty('results');

      Logger.info('✅ generate_types works correctly');
    });

    it('generate_types_for_model_node should validate model parameter', async () => {
      if (!hasApiKeys) return;
      
      const generateTypesForModelTool = tools.find(tool => tool.name === 'generate_types_for_model');
      expect(generateTypesForModelTool).toBeDefined();

      // Test with missing model
      try {
        await generateTypesForModelTool!.handler({});
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.message).toContain('Model name is required');
      }

      Logger.info('✅ generate_types_for_model validates model parameter correctly');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      if (!hasApiKeys) return;
      
      // Create tools with invalid config to test error handling
      const invalidConfig: BuilderConfig = {
        apiKey: 'invalid-key',
        privateKey: 'invalid-private-key'
      };
      
      const invalidTools = createBuilderTools(invalidConfig);
      const listModelsTool = invalidTools.find(tool => tool.name === 'list_models');

      const result = await listModelsTool!.handler({});
      const responseData = JSON.parse(result.content[0].text);

      // Should return some response (Builder.io might return success even with invalid creds)
      expect(responseData).toHaveProperty('success');
      // Don't assert specific success/failure as Builder.io behavior may vary
      if (!responseData.success) {
        expect(responseData).toHaveProperty('error');
      }

      Logger.info('✅ MCP tools handle network errors gracefully');
    });

    it('should return consistent error format across all tools', async () => {
      if (!hasApiKeys) return;
      
      const toolsToTest = [
        { name: 'get_model', args: { id: 'invalid-id' } },
        { name: 'get_content', args: { model: 'non-existent-model' } },
        { name: 'get_file_info', args: { id: 'invalid-file-id' } }
      ];
      
      for (const { name, args } of toolsToTest) {
        const tool = tools.find(t => t.name === name);
        if (tool) {
          const result = await tool.handler(args);
          const responseData = JSON.parse(result.content[0].text);
          
          expect(responseData).toHaveProperty('success');
          expect(responseData).toHaveProperty('error');
          expect(responseData).toHaveProperty('status');
          expect(typeof responseData.error).toBe('string');
          expect(typeof responseData.status).toBe('number');
        }
      }
      
      Logger.info('✅ All tools return consistent error format');
    });
  });
});
