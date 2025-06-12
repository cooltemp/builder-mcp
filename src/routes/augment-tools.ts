import { Router } from 'express';
import Joi from 'joi';
import { builderAdminApi } from '@/builder/admin-api';
import { builderContentApi } from '@/builder/content-api';
import { typeScriptGenerator } from '@/types/generator';
import { augmentContextProvider } from '@/augment/context';
import { validateRequest } from '@/middleware/validation';
import { optionalAuth } from '@/middleware/auth';
import { asyncHandler, createError } from '@/middleware/error';
import logger from '@/utils/logger';

const router = Router();

/**
 * POST /augment-tools/create-model
 * Augment-optimized endpoint to create a new Builder.io model
 */
router.post(
  '/create-model',
  optionalAuth,
  validateRequest({
    body: Joi.object({
      name: Joi.string().required().min(1).max(100),
      description: Joi.string().max(500),
      kind: Joi.string().valid('page', 'data', 'component').default('data'),
      fields: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          type: Joi.string().required(),
          required: Joi.boolean().default(false),
          description: Joi.string().max(200),
          defaultValue: Joi.any(),
          enum: Joi.array().items(Joi.string())
        })
      ).required().min(1)
    })
  }),
  asyncHandler(async (req, res) => {
    const { name, description, kind, fields } = req.body;

    logger.info('Augment: Creating new Builder.io model', { name, kind, fieldCount: fields.length });

    // Check if model already exists
    const existingModels = await builderAdminApi.getModels();
    const existingModel = existingModels.find(m => m.name.toLowerCase() === name.toLowerCase());
    
    if (existingModel) {
      throw createError.conflict(`Model '${name}' already exists`);
    }

    // Create the model
    const modelData = {
      name,
      kind,
      fields: fields.map((field: any) => ({
        name: field.name,
        type: field.type,
        required: field.required || false,
        helperText: field.description,
        defaultValue: field.defaultValue,
        enum: field.enum
      })),
      meta: {
        description,
        tags: ['augment-generated']
      }
    };

    const newModel = await builderAdminApi.createModel(modelData);

    // Auto-generate TypeScript interfaces
    const typeInfo = await typeScriptGenerator.generateModelType(newModel);

    res.status(201).json({
      success: true,
      data: {
        model: newModel,
        typeScript: typeInfo
      },
      message: `Model '${name}' created successfully with TypeScript interfaces`,
      augment: {
        action: 'model_created',
        modelId: newModel.id,
        typesGenerated: true,
        nextSteps: [
          'You can now create content entries for this model',
          'TypeScript interfaces are available for download',
          'Consider updating your frontend types'
        ]
      }
    });
  })
);

/**
 * POST /augment-tools/create-content
 * Augment-optimized endpoint to create content with intelligent defaults
 */
router.post(
  '/create-content',
  optionalAuth,
  validateRequest({
    body: Joi.object({
      modelId: Joi.string().required(),
      name: Joi.string().required(),
      data: Joi.object().required(),
      published: Joi.boolean().default(false),
      autoPublish: Joi.boolean().default(false),
      generateSlug: Joi.boolean().default(true)
    })
  }),
  asyncHandler(async (req, res) => {
    const { modelId, name, data, published, autoPublish, generateSlug } = req.body;

    logger.info('Augment: Creating content entry', { modelId, name });

    // Verify model exists
    const model = await builderAdminApi.getModel(modelId);

    // Generate URL slug if requested
    let urlPath;
    if (generateSlug && data.title) {
      urlPath = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const contentData = {
      name,
      data,
      published: (published || autoPublish ? 'published' : 'draft') as 'published' | 'draft',
      meta: {
        title: data.title || name,
        description: data.description || data.excerpt,
        urlPath
      }
    };

    const newContent = await builderContentApi.createContent(modelId, contentData);

    // Auto-publish if requested
    if (autoPublish && !published) {
      await builderContentApi.publishContent(modelId, newContent.id);
    }

    res.status(201).json({
      success: true,
      data: newContent,
      message: `Content '${name}' created successfully`,
      augment: {
        action: 'content_created',
        contentId: newContent.id,
        modelName: model.name,
        published: autoPublish || published,
        urlPath,
        nextSteps: [
          autoPublish || published ? 'Content is live' : 'Content saved as draft - publish when ready',
          'Content is available in Builder.io editor',
          'Consider updating related frontend components'
        ]
      }
    });
  })
);

/**
 * POST /augment-tools/sync-types
 * Generate and sync TypeScript types with frontend
 */
router.post(
  '/sync-types',
  optionalAuth,
  validateRequest({
    body: Joi.object({
      models: Joi.array().items(Joi.string()).optional(),
      updateFrontend: Joi.boolean().default(false)
    })
  }),
  asyncHandler(async (req, res) => {
    const { models: modelIds, updateFrontend } = req.body;

    logger.info('Augment: Syncing TypeScript types', { modelIds, updateFrontend });

    // Get models to generate types for
    let models;
    if (modelIds && modelIds.length > 0) {
      models = [];
      for (const modelId of modelIds) {
        const model = await builderAdminApi.getModel(modelId);
        models.push(model);
      }
    } else {
      models = await builderAdminApi.getModels({ includeFields: true });
    }

    // Generate TypeScript interfaces
    const generatedTypes = await typeScriptGenerator.generateAllTypes(models);

    const response: any = {
      success: true,
      data: {
        generated: generatedTypes.length,
        types: generatedTypes,
        outputDirectory: typeScriptGenerator['outputDir']
      },
      message: `Generated TypeScript interfaces for ${generatedTypes.length} models`,
      augment: {
        action: 'types_synced',
        typesGenerated: generatedTypes.length,
        models: models.map(m => ({ id: m.id, name: m.name }))
      }
    };

    // If frontend update is requested, provide file contents
    if (updateFrontend) {
      const fs = await import('fs');
      const path = await import('path');
      
      const typeFiles = generatedTypes.map(typeInfo => {
        const content = fs.readFileSync(typeInfo.filePath, 'utf8');
        return {
          fileName: path.basename(typeInfo.filePath),
          content,
          interfaceName: typeInfo.interfaceName,
          modelName: typeInfo.modelName
        };
      });

      response.data.files = typeFiles;
      response.augment.nextSteps = [
        'TypeScript interfaces generated',
        'Files ready for frontend integration',
        'Consider updating import statements in your components'
      ];
    }

    res.json(response);
  })
);

/**
 * GET /augment-tools/status
 * Get current status and suggestions for Augment
 */
router.get(
  '/status',
  optionalAuth,
  asyncHandler(async (_req, res) => {
    logger.info('Augment: Getting Builder.io status');

    const context = await augmentContextProvider.generateContext();

    const status = {
      models: {
        total: context.models.count,
        withContent: Object.values(context.content.byModel).filter(m => m.count > 0).length,
        empty: context.relationships.unusedModels.length
      },
      content: {
        total: context.content.totalEntries,
        published: Object.values(context.content.byModel).reduce((sum, m) => sum + m.published, 0),
        drafts: Object.values(context.content.byModel).reduce((sum, m) => sum + m.draft, 0)
      },
      types: {
        generated: context.types.count,
        upToDate: context.types.count === context.models.count
      },
      suggestions: context.suggestions
    };

    const recommendations = [];
    
    if (status.models.empty > 0) {
      recommendations.push(`You have ${status.models.empty} models without content. Consider adding content or removing unused models.`);
    }
    
    if (!status.types.upToDate) {
      recommendations.push('Your TypeScript types may be outdated. Consider regenerating them.');
    }
    
    if (status.content.drafts > status.content.published) {
      recommendations.push(`You have ${status.content.drafts} draft content entries. Review and publish when ready.`);
    }

    res.json({
      success: true,
      data: status,
      recommendations,
      augment: {
        action: 'status_check',
        healthy: status.types.upToDate && status.models.empty === 0,
        nextActions: recommendations
      }
    });
  })
);

export default router;
