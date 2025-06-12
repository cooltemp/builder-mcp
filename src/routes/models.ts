import { Router } from 'express';
import { builderAdminApi } from '@/builder/admin-api';
import { validateRequest, commonSchemas } from '@/middleware/validation';
import { authenticateApiKey, requireRole } from '@/middleware/auth';
import { asyncHandler, createError } from '@/middleware/error';
import logger from '@/utils/logger';

const router = Router();

/**
 * GET /models
 * Fetch all Builder.io models
 */
router.get(
  '/',
  authenticateApiKey,
  validateRequest({
    query: commonSchemas.pagination,
  }),
  asyncHandler(async (req, res) => {
    const { limit, offset } = req.query;

    logger.info('Fetching Builder.io models', { limit, offset });

    const models = await builderAdminApi.getModels({
      limit: Number(limit) || 100,
      offset: Number(offset) || 0,
      includeFields: true,
    });

    res.json({
      success: true,
      data: models,
      meta: {
        count: models.length,
        limit: Number(limit) || 100,
        offset: Number(offset) || 0,
      },
    });
  })
);

/**
 * GET /models/:model
 * Fetch a specific Builder.io model by ID
 */
router.get(
  '/:model',
  authenticateApiKey,
  validateRequest({
    params: commonSchemas.modelId,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;

    logger.info('Fetching Builder.io model', { modelId });

    try {
      const model = await builderAdminApi.getModel(modelId as string);
      
      res.json({
        success: true,
        data: model,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Model with ID '${modelId}' not found`);
      }
      throw error;
    }
  })
);

/**
 * POST /models
 * Create a new Builder.io model
 */
router.post(
  '/',
  authenticateApiKey,
  requireRole('admin'),
  validateRequest({
    body: commonSchemas.createModel,
  }),
  asyncHandler(async (req, res) => {
    const modelData = req.body;

    logger.info('Creating new Builder.io model', { modelName: modelData.name });

    // Check if model with same name already exists
    const existingModels = await builderAdminApi.getModels({ limit: 1000 });
    const existingModel = existingModels.find(m => m.name === modelData.name);
    
    if (existingModel) {
      throw createError.conflict(`Model with name '${modelData.name}' already exists`);
    }

    const newModel = await builderAdminApi.createModel(modelData);

    res.status(201).json({
      success: true,
      data: newModel,
      message: `Model '${newModel.name}' created successfully`,
    });
  })
);

/**
 * PUT /models/:model
 * Update an existing Builder.io model
 */
router.put(
  '/:model',
  authenticateApiKey,
  requireRole('admin'),
  validateRequest({
    params: commonSchemas.modelId,
    body: commonSchemas.createModel, // Reuse the same schema for updates
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;
    const updates = req.body;

    logger.info('Updating Builder.io model', { modelId, updates });

    try {
      const updatedModel = await builderAdminApi.updateModel(modelId as string, updates);
      
      res.json({
        success: true,
        data: updatedModel,
        message: `Model '${modelId}' updated successfully`,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Model with ID '${modelId}' not found`);
      }
      throw error;
    }
  })
);

/**
 * DELETE /models/:model
 * Delete a Builder.io model
 */
router.delete(
  '/:model',
  authenticateApiKey,
  requireRole('admin'),
  validateRequest({
    params: commonSchemas.modelId,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;

    logger.info('Deleting Builder.io model', { modelId });

    try {
      await builderAdminApi.deleteModel(modelId as string);
      
      res.json({
        success: true,
        message: `Model '${modelId}' deleted successfully`,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Model with ID '${modelId}' not found`);
      }
      throw error;
    }
  })
);

/**
 * GET /models/:model/fields
 * Get fields for a specific model
 */
router.get(
  '/:model/fields',
  authenticateApiKey,
  validateRequest({
    params: commonSchemas.modelId,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;

    logger.info('Fetching model fields', { modelId });

    try {
      const model = await builderAdminApi.getModel(modelId as string);
      
      res.json({
        success: true,
        data: {
          modelId: model.id,
          modelName: model.name,
          fields: model.fields,
        },
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Model with ID '${modelId}' not found`);
      }
      throw error;
    }
  })
);

/**
 * GET /models/:model/schema
 * Get JSON schema for a specific model
 */
router.get(
  '/:model/schema',
  authenticateApiKey,
  validateRequest({
    params: commonSchemas.modelId,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;

    logger.info('Generating JSON schema for model', { modelId });

    try {
      const model = await builderAdminApi.getModel(modelId as string);
      
      // Generate JSON schema from Builder model
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        title: model.name,
        description: model.meta?.description || `Schema for ${model.name} model`,
        properties: model.fields.reduce((props: any, field) => {
          props[field.name] = {
            type: mapBuilderTypeToJsonSchema(field.type),
            description: field.helperText,
          };
          
          if (field.enum) {
            props[field.name].enum = field.enum;
          }
          
          return props;
        }, {}),
        required: model.fields.filter(f => f.required).map(f => f.name),
      };
      
      res.json({
        success: true,
        data: schema,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Model with ID '${modelId}' not found`);
      }
      throw error;
    }
  })
);

/**
 * Helper function to map Builder field types to JSON Schema types
 */
function mapBuilderTypeToJsonSchema(builderType: string): string {
  switch (builderType) {
    case 'text':
    case 'longText':
    case 'richText':
    case 'color':
    case 'url':
    case 'email':
    case 'file':
    case 'date':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'list':
    case 'blocks':
      return 'array';
    case 'object':
    case 'reference':
      return 'object';
    default:
      return 'string';
  }
}

export default router;
