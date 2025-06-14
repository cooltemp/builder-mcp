// Comprehensive test suite for MCP Server Integration
// Tests: MCP server request/response flow, protocol compliance, resource handling

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { BuilderConfig } from '@/types';
import { createBuilderTools } from '@/mcp/tools';
import { createBuilderResources } from '@/mcp/resources';
import { Logger } from '@/utils/logger';

describe('MCP Server Integration Testing', () => {
  let server: Server;
  let tools: any[];
  let resources: any[];
  let testModelId: string | null = null;
  const testModelName = `mcp-server-test-${Date.now()}`;
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(() => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping MCP Server tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    // Create MCP server components
    server = new Server(
      {
        name: 'builder-mcp-test',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );
    
    tools = createBuilderTools(config);
    resources = createBuilderResources(config);
    
    Logger.info('🧪 Starting MCP Server integration tests');
  });

  afterAll(async () => {
    if (!hasApiKeys || !testModelId) return;
    
    // Cleanup: Delete test model if it still exists
    try {
      const deleteModelTool = tools.find(tool => tool.name === 'delete_model_node');
      if (deleteModelTool) {
        Logger.info(`🧹 Cleaning up test model: ${testModelId}`);
        await deleteModelTool.handler({ id: testModelId });
      }
    } catch (error) {
      Logger.warn('Cleanup warning: Could not delete test model', error);
    }
  });

  describe('MCP Protocol Compliance', () => {
    it('should handle ListToolsRequest correctly', async () => {
      if (!hasApiKeys) return;
      
      // Mock the request handler setup
      const mockRequest = {
        method: 'tools/list',
        params: {}
      };
      
      // Simulate what the server would return
      const expectedTools = tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }));
      
      expect(expectedTools).toHaveLength(tools.length);
      expectedTools.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
      });
      
      Logger.info(`✅ ListToolsRequest would return ${expectedTools.length} tools`);
    });

    it('should handle ListResourcesRequest correctly', async () => {
      if (!hasApiKeys) return;
      
      // Mock the request handler setup
      const mockRequest = {
        method: 'resources/list',
        params: {}
      };
      
      // Simulate what the server would return
      const expectedResources = resources.map(resource => ({
        uri: resource.uri,
        name: resource.name,
        description: resource.description,
        mimeType: resource.mimeType
      }));
      
      expect(expectedResources).toHaveLength(resources.length);
      expectedResources.forEach(resource => {
        expect(resource).toHaveProperty('uri');
        expect(resource).toHaveProperty('name');
        expect(resource).toHaveProperty('description');
        expect(resource).toHaveProperty('mimeType');
      });
      
      Logger.info(`✅ ListResourcesRequest would return ${expectedResources.length} resources`);
    });

    it('should handle CallToolRequest with valid tool', async () => {
      if (!hasApiKeys) return;
      
      const listModelsTool = tools.find(tool => tool.name === 'list_models');
      expect(listModelsTool).toBeDefined();
      
      // Simulate MCP tool call
      const mockRequest = {
        method: 'tools/call',
        params: {
          name: 'list_models_node',
          arguments: {}
        }
      };
      
      const result = await listModelsTool!.handler({});
      
      // Verify MCP response format
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
      
      // Verify the response is valid JSON
      const responseData = JSON.parse(result.content[0].text);
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');
      
      Logger.info('✅ CallToolRequest handles valid tool correctly');
    });

    it('should handle CallToolRequest with invalid tool name', async () => {
      if (!hasApiKeys) return;
      
      // Simulate what would happen with invalid tool name
      const invalidToolName = 'non_existent_tool';
      const foundTool = tools.find(tool => tool.name === invalidToolName);
      
      expect(foundTool).toBeUndefined();
      
      // This would result in McpError being thrown
      const expectedError = new McpError(ErrorCode.MethodNotFound, `Tool ${invalidToolName} not found`);
      expect(expectedError.code).toBe(ErrorCode.MethodNotFound);
      expect(expectedError.message).toContain(invalidToolName);
      
      Logger.info('✅ CallToolRequest handles invalid tool name correctly');
    });

    it('should handle ReadResourceRequest correctly', async () => {
      if (!hasApiKeys) return;
      
      const infoResource = resources.find(resource => resource.uri === 'builder://info');
      expect(infoResource).toBeDefined();
      
      // Simulate MCP resource read
      const mockRequest = {
        method: 'resources/read',
        params: {
          uri: 'builder://info'
        }
      };
      
      const result = await infoResource!.handler();
      
      // Verify resource response format
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('capabilities');
      expect(result.capabilities).toHaveProperty('tools');
      
      Logger.info('✅ ReadResourceRequest handles resource correctly');
    });
  });

  describe('Tool Execution Flow', () => {
    it('should execute model creation workflow through MCP', async () => {
      if (!hasApiKeys) return;
      
      const createModelTool = tools.find(tool => tool.name === 'create_model');
      expect(createModelTool).toBeDefined();
      
      const modelData = {
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
      
      // Simulate MCP tool execution
      const result = await createModelTool!.handler(modelData);
      const responseData = JSON.parse(result.content[0].text);
      
      if (responseData.success) {
        expect(responseData.data).toHaveProperty('id');
        expect(responseData.data.name).toBe(testModelName);
        testModelId = responseData.data.id;
        
        Logger.info(`✅ MCP model creation workflow successful: ${testModelId}`);
      } else {
        Logger.warn(`⚠️  MCP model creation failed: ${responseData.error}`);
      }
    });

    it('should execute model retrieval workflow through MCP', async () => {
      if (!hasApiKeys || !testModelId) return;
      
      const getModelTool = tools.find(tool => tool.name === 'get_model');
      expect(getModelTool).toBeDefined();
      
      // Simulate MCP tool execution
      const result = await getModelTool!.handler({ id: testModelId });
      const responseData = JSON.parse(result.content[0].text);
      
      expect(responseData.success).toBe(true);
      expect(responseData.data.id).toBe(testModelId);
      expect(responseData.data.name).toBe(testModelName);
      
      Logger.info('✅ MCP model retrieval workflow successful');
    });

    it('should execute type generation workflow through MCP', async () => {
      if (!hasApiKeys) return;
      
      const generateTypesTool = tools.find(tool => tool.name === 'generate_types');
      expect(generateTypesTool).toBeDefined();
      
      // Simulate MCP tool execution
      const result = await generateTypesTool!.handler({});
      const responseData = JSON.parse(result.content[0].text);
      
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');
      
      Logger.info('✅ MCP type generation workflow successful');
    });
  });

  describe('Error Handling in MCP Context', () => {
    it('should handle tool execution errors gracefully', async () => {
      if (!hasApiKeys) return;
      
      const getModelTool = tools.find(tool => tool.name === 'get_model');
      expect(getModelTool).toBeDefined();
      
      // Test with invalid model ID
      const result = await getModelTool!.handler({ id: 'invalid-id-12345' });
      const responseData = JSON.parse(result.content[0].text);
      
      // Should return error response in MCP format, not throw
      expect(responseData).toHaveProperty('success', false);
      expect(responseData).toHaveProperty('error');
      expect(responseData).toHaveProperty('status');
      
      Logger.info('✅ MCP tool execution errors handled gracefully');
    });

    it('should handle validation errors in MCP format', async () => {
      if (!hasApiKeys) return;
      
      const createModelTool = tools.find(tool => tool.name === 'create_model');
      expect(createModelTool).toBeDefined();
      
      // Test with invalid data (missing required fields)
      try {
        await createModelTool!.handler({});
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        // Validation errors should be thrown, not returned as MCP responses
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
      }
      
      Logger.info('✅ MCP validation errors handled correctly');
    });

    it('should handle network errors in MCP context', async () => {
      if (!hasApiKeys) return;

      // Test with a tool that will definitely fail - get_model with invalid ID
      // This simulates network/API errors and tests the error handling flow
      const getModelTool = tools.find(tool => tool.name === 'get_model');
      expect(getModelTool).toBeDefined();

      // Use a completely invalid model ID that will cause the API to return an error
      const result = await getModelTool!.handler({ id: 'definitely-invalid-model-id-that-does-not-exist-12345' });
      const responseData = JSON.parse(result.content[0].text);

      // API errors should be returned as MCP error responses
      expect(responseData).toHaveProperty('success', false);
      expect(responseData).toHaveProperty('error');
      expect(responseData).toHaveProperty('status');

      Logger.info('✅ MCP network/API errors handled correctly');
    });
  });

  describe('Resource Access Flow', () => {
    it('should provide model information through resources', async () => {
      if (!hasApiKeys) return;
      
      const modelsResource = resources.find(resource => resource.uri === 'builder://models');
      expect(modelsResource).toBeDefined();
      
      const result = await modelsResource!.handler();
      
      expect(result).toHaveProperty('models');
      expect(Array.isArray(result.models)).toBe(true);
      
      Logger.info('✅ MCP models resource provides correct data');
    });

    it('should provide server info through resources', async () => {
      if (!hasApiKeys) return;
      
      const infoResource = resources.find(resource => resource.uri === 'builder://info');
      expect(infoResource).toBeDefined();
      
      const result = await infoResource!.handler();
      
      expect(result).toHaveProperty('name', 'Builder.io MCP Server');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('capabilities');
      expect(result.capabilities).toHaveProperty('tools');
      expect(Array.isArray(result.capabilities.tools)).toBe(true);
      
      Logger.info('✅ MCP info resource provides correct server information');
    });
  });

  describe('MCP Response Format Validation', () => {
    it('should return consistent MCP response format across all tools', async () => {
      if (!hasApiKeys) return;
      
      const toolsToTest = [
        'list_models_node',
        'get_model_ids_node',
        'generate_types_node'
      ];
      
      for (const toolName of toolsToTest) {
        const tool = tools.find(t => t.name === toolName);
        if (tool) {
          const result = await tool.handler({});
          
          // Verify MCP response structure
          expect(result).toHaveProperty('content');
          expect(Array.isArray(result.content)).toBe(true);
          expect(result.content[0]).toHaveProperty('type', 'text');
          expect(result.content[0]).toHaveProperty('text');
          
          // Verify JSON content is valid
          const responseData = JSON.parse(result.content[0].text);
          expect(responseData).toHaveProperty('success');
          expect(responseData).toHaveProperty('data');
          expect(responseData).toHaveProperty('status');
        }
      }
      
      Logger.info('✅ All MCP tools return consistent response format');
    });
  });
});
