import { Router } from 'express';
import Joi from 'joi';
import { builderContentApi } from '@/builder/content-api';
import { builderAdminApi } from '@/builder/admin-api';
import { validateRequest, commonSchemas } from '@/middleware/validation';
import { authenticateApiKey, requireRole } from '@/middleware/auth';
import { asyncHandler, createError } from '@/middleware/error';
import logger from '@/utils/logger';

const router = Router();

/**
 * GET /content/:model
 * Get content entries for a specific model
 */
router.get(
  '/:model',
  authenticateApiKey,
  validateRequest({
    params: commonSchemas.modelId,
    query: commonSchemas.contentQuery,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;
    const { limit, offset, published, sortBy, sortOrder, query } = req.query;

    logger.info('Fetching content entries', { modelId, limit, offset, published });

    // Parse query if provided
    let parsedQuery;
    if (query) {
      try {
        parsedQuery = JSON.parse(query as string);
      } catch (error) {
        throw createError.badRequest('Invalid query parameter - must be valid JSON');
      }
    }

    const content = await builderContentApi.getContent(modelId as string, {
      limit: Number(limit),
      offset: Number(offset),
      published: published as any,
      sortBy: sortBy as string,
      sortOrder: sortOrder as any,
      query: parsedQuery,
    });

    res.json({
      success: true,
      data: content,
      meta: {
        count: content.length,
        limit: Number(limit),
        offset: Number(offset),
        modelId,
      },
    });
  })
);

/**
 * GET /content/:model/:id
 * Get a specific content entry by ID
 */
router.get(
  '/:model/:id',
  authenticateApiKey,
  validateRequest({
    params: Joi.object({
      model: Joi.string().required().min(1).max(100),
      id: Joi.string().required().min(1).max(100),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId, id: contentId } = req.params;

    logger.info('Fetching content entry', { modelId, contentId });

    try {
      const content = await builderContentApi.getContentById(modelId as string, contentId as string);
      
      res.json({
        success: true,
        data: content,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Content with ID '${contentId}' not found in model '${modelId}'`);
      }
      throw error;
    }
  })
);

/**
 * POST /content/:model
 * Create new content entry
 */
router.post(
  '/:model',
  authenticateApiKey,
  requireRole('editor'),
  validateRequest({
    params: commonSchemas.modelId,
    body: commonSchemas.createContent,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;
    const contentData = req.body;

    logger.info('Creating new content entry', { modelId, contentName: contentData.name });

    // Verify model exists
    try {
      await builderAdminApi.getModel(modelId as string);
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Model with ID '${modelId}' not found`);
      }
      throw error;
    }

    // Validate content data against model schema (basic validation)
    // In a production app, you might want more sophisticated validation
    if (!contentData.data || typeof contentData.data !== 'object') {
      throw createError.badRequest('Content data must be a valid object');
    }

    const newContent = await builderContentApi.createContent(modelId as string, contentData);

    res.status(201).json({
      success: true,
      data: newContent,
      message: `Content '${newContent.name}' created successfully`,
    });
  })
);

/**
 * PUT /content/:model/:id
 * Update existing content entry
 */
router.put(
  '/:model/:id',
  authenticateApiKey,
  requireRole('editor'),
  validateRequest({
    params: Joi.object({
      model: Joi.string().required().min(1).max(100),
      id: Joi.string().required().min(1).max(100),
    }),
    body: commonSchemas.updateContent,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId, id: contentId } = req.params;
    const updates = req.body;

    logger.info('Updating content entry', { modelId, contentId, updates });

    try {
      const updatedContent = await builderContentApi.updateContent(modelId as string, contentId as string, updates);
      
      res.json({
        success: true,
        data: updatedContent,
        message: `Content '${contentId}' updated successfully`,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Content with ID '${contentId}' not found in model '${modelId}'`);
      }
      throw error;
    }
  })
);

/**
 * DELETE /content/:model/:id
 * Delete content entry
 */
router.delete(
  '/:model/:id',
  authenticateApiKey,
  requireRole('editor'),
  validateRequest({
    params: Joi.object({
      model: Joi.string().required().min(1).max(100),
      id: Joi.string().required().min(1).max(100),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId, id: contentId } = req.params;

    logger.info('Deleting content entry', { modelId, contentId });

    try {
      await builderContentApi.deleteContent(modelId as string, contentId as string);
      
      res.json({
        success: true,
        message: `Content '${contentId}' deleted successfully`,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Content with ID '${contentId}' not found in model '${modelId}'`);
      }
      throw error;
    }
  })
);

/**
 * POST /content/:model/:id/publish
 * Publish content entry
 */
router.post(
  '/:model/:id/publish',
  authenticateApiKey,
  requireRole('editor'),
  validateRequest({
    params: Joi.object({
      model: Joi.string().required().min(1).max(100),
      id: Joi.string().required().min(1).max(100),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId, id: contentId } = req.params;

    logger.info('Publishing content entry', { modelId, contentId });

    try {
      const publishedContent = await builderContentApi.publishContent(modelId as string, contentId as string);
      
      res.json({
        success: true,
        data: publishedContent,
        message: `Content '${contentId}' published successfully`,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Content with ID '${contentId}' not found in model '${modelId}'`);
      }
      throw error;
    }
  })
);

/**
 * POST /content/:model/:id/unpublish
 * Unpublish content entry
 */
router.post(
  '/:model/:id/unpublish',
  authenticateApiKey,
  requireRole('editor'),
  validateRequest({
    params: Joi.object({
      model: Joi.string().required().min(1).max(100),
      id: Joi.string().required().min(1).max(100),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId, id: contentId } = req.params;

    logger.info('Unpublishing content entry', { modelId, contentId });

    try {
      const unpublishedContent = await builderContentApi.unpublishContent(modelId as string, contentId as string);
      
      res.json({
        success: true,
        data: unpublishedContent,
        message: `Content '${contentId}' unpublished successfully`,
      });
    } catch (error: any) {
      if (error.code === '404') {
        throw createError.notFound(`Content with ID '${contentId}' not found in model '${modelId}'`);
      }
      throw error;
    }
  })
);

/**
 * POST /content/:model/bulk
 * Bulk create/update content entries
 */
router.post(
  '/:model/bulk',
  authenticateApiKey,
  requireRole('editor'),
  validateRequest({
    params: commonSchemas.modelId,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;
    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
      throw createError.badRequest('Entries must be a non-empty array');
    }

    logger.info('Bulk creating/updating content entries', { 
      modelId, 
      count: entries.length 
    });

    const results = [];
    const errors = [];

    for (let i = 0; i < entries.length; i++) {
      try {
        const entry = entries[i];
        let result;

        if (entry.id) {
          // Update existing entry
          result = await builderContentApi.updateContent(modelId as string, entry.id, entry);
        } else {
          // Create new entry
          result = await builderContentApi.createContent(modelId as string, entry);
        }

        results.push({ index: i, success: true, data: result });
      } catch (error: any) {
        errors.push({ 
          index: i, 
          success: false, 
          error: error.message,
          entry: entries[i] 
        });
      }
    }

    res.json({
      success: errors.length === 0,
      data: {
        processed: entries.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors,
      },
      message: `Processed ${entries.length} entries: ${results.length} successful, ${errors.length} failed`,
    });
  })
);

export default router;
