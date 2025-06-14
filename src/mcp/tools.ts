// MCP tools for Builder.io operations
import { BuilderConfig } from '@/types';
import { BuilderAdminService } from '@/services/builderAdmin';
import { BuilderContentService } from '@/services/builderContent';
import { BuilderWriteService } from '@/services/builderWrite';
import { BuilderUploadService } from '@/services/builderUpload';
import { TypeGenerator } from '@/services/typeGenerator';
import { Logger } from '@/utils/logger';
import { validateRequired, validateModelName, validateContentData } from '@/utils/validation';
import { TypeValidator } from '@/utils/typeValidation';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

export function createBuilderTools(config: BuilderConfig): McpTool[] {
  const adminService = new BuilderAdminService(config);
  const contentService = new BuilderContentService(config);
  const writeService = new BuilderWriteService(config);
  const uploadService = new BuilderUploadService(config);
  const typeGenerator = new TypeGenerator();

  // Helper function to ensure types are generated and validated for a model
  const ensureTypesForModel = async (modelName: string) => {
    Logger.info(`🔄 Ensuring types are up-to-date for model: ${modelName}`);

    try {
      // Use your existing generateTypes script logic
      const modelResult = await adminService.getModelByName(modelName);
      if (!modelResult.success) {
        throw new Error(`Failed to fetch model schema for ${modelName}: ${modelResult.error}`);
      }

      const modelData = modelResult.data;
      if (!modelData) {
        throw new Error(`Model ${modelName} not found`);
      }

      // Get all models for reference mapping (required for cross-references)
      const modelsResult = await adminService.getModels();
      if (modelsResult.success && modelsResult.data?.models) {
        typeGenerator.setModelMapping(modelsResult.data.models);
      }

      // Generate TypeScript interface based on actual schema
      const generatedInterface = typeGenerator.generateInterface(modelData);

      // Write the interface to file
      await typeGenerator.writeInterface(generatedInterface);

      Logger.info(`✅ Generated types for model: ${modelName} -> ${generatedInterface.filePath}`);

      return {
        success: true,
        modelName,
        filePath: generatedInterface.filePath,
        interfaceName: generatedInterface.name
      };
    } catch (error: any) {
      Logger.error(`❌ Failed to generate types for model ${modelName}:`, error);
      throw error;
    }
  };

  return [
    // Model tools
    {
      name: 'list_models',
      description: 'List all Builder.io models',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      handler: async () => {
        Logger.info('Fetching all models');
        const result = await adminService.getModels();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'get_model_ids',
      description: 'Get model IDs and names only',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      handler: async () => {
        Logger.info('Fetching model IDs and names');
        const result = await adminService.getModelIds();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'get_model',
      description: 'Get a specific Builder.io model by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Model ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      handler: async (args: { id: string }) => {
        validateRequired(args.id, 'Model ID');
        Logger.info(`Fetching model: ${args.id}`);
        const result = await adminService.getModel(args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'create_model',
      description: 'Create a new Builder.io model',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Model name',
          },
          fields: {
            type: 'array',
            description: 'Model fields',
            items: {
              type: 'object',
            },
          },
          description: {
            type: 'string',
            description: 'Model description',
          },
        },
        required: ['name'],
        additionalProperties: true,
      },
      handler: async (args: any) => {
        validateRequired(args.name, 'Model name');
        validateModelName(args.name);
        Logger.info(`Creating model: ${args.name}`);
        const result = await adminService.createModel(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'update_model',
      description: 'Update an existing Builder.io model',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Model ID',
          },
          name: {
            type: 'string',
            description: 'Model name',
          },
          fields: {
            type: 'array',
            description: 'Model fields',
            items: {
              type: 'object',
            },
          },
          description: {
            type: 'string',
            description: 'Model description',
          },
        },
        required: ['id'],
        additionalProperties: true,
      },
      handler: async (args: any) => {
        validateRequired(args.id, 'Model ID');
        if (args.name) {
          validateModelName(args.name);
        }
        Logger.info(`Updating model: ${args.id}`);
        const { id, ...updates } = args;
        const result = await adminService.updateModel(id, updates);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'delete_model',
      description: 'Delete a Builder.io model',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Model ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      handler: async (args: { id: string }) => {
        validateRequired(args.id, 'Model ID');
        Logger.info(`Deleting model: ${args.id}`);
        const result = await adminService.deleteModel(args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    // Content tools
    {
      name: 'get_content',
      description: 'Get content entries for a model',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
          limit: {
            type: 'number',
            description: 'Number of entries to return',
          },
          offset: {
            type: 'number',
            description: 'Number of entries to skip',
          },
          includeRefs: {
            type: 'boolean',
            description: 'Include referenced content',
          },
          cacheSeconds: {
            type: 'number',
            description: 'Cache duration in seconds',
          },
          query: {
            type: 'object',
            description: 'Additional query parameters',
          },
        },
        required: ['model'],
        additionalProperties: false,
      },
      handler: async (args: any) => {
        validateRequired(args.model, 'Model name');
        Logger.info(`Fetching content for model: ${args.model}`);
        const { model, ...query } = args;
        const result = await contentService.getContent(model, query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'get_content_by_id',
      description: 'Get a specific content entry by ID',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
          id: {
            type: 'string',
            description: 'Content ID',
          },
          includeUnpublished: {
            type: 'boolean',
            description: 'Include unpublished content',
          },
        },
        required: ['model', 'id'],
        additionalProperties: false,
      },
      handler: async (args: any) => {
        validateRequired(args.model, 'Model name');
        validateRequired(args.id, 'Content ID');
        Logger.info(`Fetching content: ${args.model}/${args.id}`);
        const { model, id, ...query } = args;
        const result = await contentService.getContentById(model, id, query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'create_content',
      description: 'Create new content entry',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
          data: {
            type: 'object',
            description: 'Content data',
          },
          name: {
            type: 'string',
            description: 'Content name',
          },
        },
        required: ['model', 'data'],
        additionalProperties: false,
      },
      handler: async (args: any) => {
        validateRequired(args.model, 'Model name');
        validateContentData(args.data);

        // Ensure types are generated and up-to-date before creating content
        const typeResult = await ensureTypesForModel(args.model);

        Logger.info(`Creating content for model: ${args.model} (types generated: ${typeResult.interfaceName})`);
        const result = await writeService.createContent(args.model, args.data, args.name);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'update_content',
      description: 'Update existing content entry',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
          id: {
            type: 'string',
            description: 'Content ID',
          },
          data: {
            type: 'object',
            description: 'Content data updates',
          },
          name: {
            type: 'string',
            description: 'Content name',
          },
        },
        required: ['model', 'id'],
        additionalProperties: true,
      },
      handler: async (args: any) => {
        validateRequired(args.model, 'Model name');
        validateRequired(args.id, 'Content ID');
        if (args.data) {
          validateContentData(args.data);
        }

        // Ensure types are generated and up-to-date before updating content
        const typeResult = await ensureTypesForModel(args.model);

        Logger.info(`Updating content: ${args.model}/${args.id} (types generated: ${typeResult.interfaceName})`);
        const { model, id, ...updates } = args;
        const result = await writeService.updateContent(model, id, updates);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'publish_content',
      description: 'Publish content entry',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
          id: {
            type: 'string',
            description: 'Content ID',
          },
        },
        required: ['model', 'id'],
        additionalProperties: false,
      },
      handler: async (args: { model: string; id: string }) => {
        validateRequired(args.model, 'Model name');
        validateRequired(args.id, 'Content ID');
        Logger.info(`Publishing content: ${args.model}/${args.id}`);
        const result = await writeService.publishContent(args.model, args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'unpublish_content',
      description: 'Unpublish content entry',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
          id: {
            type: 'string',
            description: 'Content ID',
          },
        },
        required: ['model', 'id'],
        additionalProperties: false,
      },
      handler: async (args: { model: string; id: string }) => {
        validateRequired(args.model, 'Model name');
        validateRequired(args.id, 'Content ID');
        Logger.info(`Unpublishing content: ${args.model}/${args.id}`);
        const result = await writeService.unpublishContent(args.model, args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    // Upload tools
    {
      name: 'upload_from_url',
      description: 'Upload file from URL to Builder.io',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL of file to upload',
          },
          filename: {
            type: 'string',
            description: 'Custom filename',
          },
          folder: {
            type: 'string',
            description: 'Folder to upload to',
          },
          metadata: {
            type: 'object',
            description: 'File metadata',
          },
        },
        required: ['url'],
        additionalProperties: false,
      },
      handler: async (args: any) => {
        validateRequired(args.url, 'URL');
        Logger.info(`Uploading from URL: ${args.url}`);
        const { url, ...options } = args;
        const result = await uploadService.uploadFromUrl(url, options);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'get_file_info',
      description: 'Get information about an uploaded file',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'File ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      handler: async (args: { id: string }) => {
        validateRequired(args.id, 'File ID');
        Logger.info(`Getting file info: ${args.id}`);
        const result = await uploadService.getFileInfo(args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'delete_file',
      description: 'Delete an uploaded file',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'File ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      handler: async (args: { id: string }) => {
        validateRequired(args.id, 'File ID');
        Logger.info(`Deleting file: ${args.id}`);
        const result = await uploadService.deleteFile(args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    // TypeScript generation tools
    {
      name: 'generate_types',
      description: 'Generate TypeScript interfaces for all models and write to files',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      handler: async () => {
        Logger.info('Generating TypeScript interfaces for all models');
        const modelsResult = await adminService.getModels();

        if (!modelsResult.success) {
          throw new Error(modelsResult.error);
        }

        const models = modelsResult.data?.models || [];
        const results = [];
        const interfaces = [];

        // Set model mapping for reference resolution
        typeGenerator.setModelMapping(models);

        // Clean generated directory first
        await typeGenerator.cleanGeneratedDir();

        for (const model of models) {
          try {
            const generatedInterface = typeGenerator.generateInterface(model);
            await typeGenerator.writeInterface(generatedInterface);
            interfaces.push(generatedInterface);

            results.push({
              model: model.name,
              success: true,
              filePath: generatedInterface.filePath,
            });
          } catch (error: any) {
            results.push({
              model: model.name,
              success: false,
              error: error.message,
            });
          }
        }

        // Generate index file
        if (interfaces.length > 0) {
          const indexContent = typeGenerator.generateIndexFile(interfaces);
          await typeGenerator.writeIndexFile(indexContent);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'TypeScript interfaces generated and written to files',
                results
              }, null, 2),
            },
          ],
        };
      },
    },

    {
      name: 'generate_types_for_model',
      description: 'Generate TypeScript interface for specific model',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name',
          },
        },
        required: ['model'],
        additionalProperties: false,
      },
      handler: async (args: { model: string }) => {
        validateRequired(args.model, 'Model name');
        Logger.info(`Generating TypeScript interface for model: ${args.model}`);

        const modelResult = await adminService.getModel(args.model);
        if (!modelResult.success) {
          throw new Error(modelResult.error);
        }

        const modelData = modelResult.data;
        if (!modelData) {
          throw new Error('Model not found');
        }

        const result = await typeGenerator.generateInterface(modelData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    // Enhanced validation tool using your existing scripts
    {
      name: 'validate_model_types',
      description: 'Validate TypeScript interfaces against actual Builder.io content for a specific model',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Model name to validate',
          },
        },
        required: ['model'],
        additionalProperties: false,
      },
      handler: async (args: { model: string }) => {
        validateRequired(args.model, 'Model name');
        Logger.info(`🔍 Validating types for model: ${args.model}`);

        try {
          // First ensure types are generated
          const typeResult = await ensureTypesForModel(args.model);

          // Then validate against actual content using your validation logic
          const contentResult = await contentService.getContent(args.model, {
            limit: 1,
            includeRefs: true,
            cacheSeconds: 0
          });

          let validation: {
            hasContent: boolean;
            typeMatches: boolean;
            schemaFields: string[];
            contentFields: string[];
            missingInContent: string[];
            extraInContent: string[];
            sampleContent: any;
          } = {
            hasContent: false,
            typeMatches: false,
            schemaFields: [],
            contentFields: [],
            missingInContent: [],
            extraInContent: [],
            sampleContent: null
          };

          if (contentResult.success && contentResult.data?.[0]) {
            const content = contentResult.data[0];
            const modelResult = await adminService.getModelByName(args.model);

            if (modelResult.success && modelResult.data) {
              const schemaFields = modelResult.data.fields
                ?.filter((field: any) => field.name && typeof field.name === 'string')
                ?.map((field: any) => field.name) || [];

              const contentFields = Object.keys(content.data || {});
              const missingInContent = schemaFields.filter((field: string) => !contentFields.includes(field));
              const extraInContent = contentFields.filter((field: string) => !schemaFields.includes(field));

              validation = {
                hasContent: true,
                typeMatches: missingInContent.length === 0 && extraInContent.length === 0,
                schemaFields,
                contentFields,
                missingInContent,
                extraInContent,
                sampleContent: content
              };
            }
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  model: args.model,
                  typeGeneration: typeResult,
                  validation,
                  summary: {
                    typesGenerated: true,
                    hasContent: validation.hasContent,
                    perfectMatch: validation.typeMatches,
                    recommendation: validation.typeMatches
                      ? '✅ Perfect match! Types are accurate and ready for use.'
                      : validation.hasContent
                        ? '⚠️ Partial match. Review missing/extra fields.'
                        : '📭 No content found. Create sample content to validate types.'
                  }
                }, null, 2),
              },
            ],
          };
        } catch (error: any) {
          Logger.error(`Validation failed for model ${args.model}:`, error);
          throw error;
        }
      },
    },
  ];
}
