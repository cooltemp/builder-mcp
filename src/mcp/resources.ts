// MCP resources for Builder.io data access
import { BuilderConfig } from '@/types';
import { BuilderAdminService } from '@/services/builderAdmin';
import { BuilderContentService } from '@/services/builderContent';
import { Logger } from '@/utils/logger';

export interface McpResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  handler: () => Promise<any>;
}

export function createBuilderResources(config: BuilderConfig): McpResource[] {
  const adminService = new BuilderAdminService(config);
  const contentService = new BuilderContentService(config);

  return [
    {
      uri: 'builder://models',
      name: 'Builder.io Models',
      description: 'List of all Builder.io models',
      mimeType: 'application/json',
      handler: async () => {
        Logger.info('Fetching models resource');
        const result = await adminService.getModels();
        if (result.success && result.data) {
          return result.data; // Return the data directly (contains models array)
        }
        return { models: [] }; // Fallback with empty models array
      },
    },

    {
      uri: 'builder://models/ids',
      name: 'Builder.io Model IDs',
      description: 'List of model IDs and names only',
      mimeType: 'application/json',
      handler: async () => {
        Logger.info('Fetching model IDs resource');
        const result = await adminService.getModelIds();
        return result;
      },
    },

    {
      uri: 'builder://schema',
      name: 'Builder.io GraphQL Schema',
      description: 'GraphQL schema introspection',
      mimeType: 'application/json',
      handler: async () => {
        Logger.info('Fetching GraphQL schema resource');
        const result = await adminService.introspectSchema();
        return result;
      },
    },

    {
      uri: 'builder://health',
      name: 'Builder.io Health Check',
      description: 'Health status of Builder.io MCP server',
      mimeType: 'application/json',
      handler: async () => {
        Logger.info('Fetching health status resource');
        return {
          success: true,
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          config: {
            hasApiKey: !!config.apiKey,
            hasPrivateKey: !!config.privateKey,
          },
        };
      },
    },

    {
      uri: 'builder://info',
      name: 'Builder.io MCP Info',
      description: 'Information about available tools and capabilities',
      mimeType: 'application/json',
      handler: async () => {
        Logger.info('Fetching MCP info resource');
        return {
          name: 'Builder.io MCP Server',
          version: '1.0.0',
          description: 'Model Context Protocol server for Builder.io headless CMS integration',
          capabilities: {
            tools: [
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
              'validate_model_types',
            ],
            resources: [
              'builder://models',
              'builder://models/ids',
              'builder://schema',
              'builder://health',
              'builder://info',
            ],
          },
          apis: {
            admin: 'https://builder.io/api/v1/admin/graphql',
            content: 'https://cdn.builder.io/api/v3/content',
            write: 'https://builder.io/api/v1/write',
            upload: 'https://builder.io/api/v1/upload',
          },
        };
      },
    },
  ];
}
