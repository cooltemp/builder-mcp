// Main MCP server implementation for Builder.io
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';
import { createBuilderTools } from './tools';
import { createBuilderResources } from './resources';

// Load environment variables
dotenv.config();

// Set MCP mode to disable console logging
process.env.MCP_MODE = 'true';

// Validate required environment variables
function validateConfig(): BuilderConfig {
  const apiKey = process.env.BUILDER_API_KEY;
  const privateKey = process.env.BUILDER_PRIVATE_KEY;

  if (!apiKey) {
    throw new Error('BUILDER_API_KEY environment variable is required');
  }

  if (!privateKey) {
    throw new Error('BUILDER_PRIVATE_KEY environment variable is required');
  }

  return {
    apiKey,
    privateKey
  };
}

async function main() {
  // Validate configuration
  let config: BuilderConfig;
  try {
    config = validateConfig();
    Logger.info('Builder.io configuration validated successfully');
  } catch (error: any) {
    Logger.error('Configuration validation failed', error.message);
    process.exit(1);
  }

  // Create MCP server
  const server = new Server(
    {
      name: 'builder-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Initialize tools and resources
  const tools = createBuilderTools(config);
  const resources = createBuilderResources(config);

  // Set up tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    Logger.info('Listing available tools');
    return {
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    Logger.info(`Calling tool: ${name}`, args);

    const tool = tools.find(t => t.name === name);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
    }

    try {
      const result = await tool.handler(args || {});
      return result;
    } catch (error: any) {
      Logger.error(`Error executing tool ${name}`, error);
      throw new McpError(ErrorCode.InternalError, error.message);
    }
  });

  // Set up resource handlers
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    Logger.info('Listing available resources');
    return {
      resources: resources.map(resource => ({
        uri: resource.uri,
        name: resource.name,
        description: resource.description,
        mimeType: resource.mimeType,
      })),
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    Logger.info(`Reading resource: ${uri}`);

    const resource = resources.find(r => r.uri === uri);
    if (!resource) {
      throw new McpError(ErrorCode.InvalidRequest, `Resource ${uri} not found`);
    }

    try {
      const content = await resource.handler();
      return {
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
          },
        ],
      };
    } catch (error: any) {
      Logger.error(`Error reading resource ${uri}`, error);
      throw new McpError(ErrorCode.InternalError, error.message);
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  Logger.info('Builder.io MCP server started');
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  Logger.error('Failed to start MCP server', error);
  process.exit(1);
});
