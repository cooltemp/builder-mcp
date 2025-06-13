// Content management routes

import { Router, Request, Response } from 'express';
import { BuilderContentService } from '@/services/builderContent';
import { BuilderWriteService } from '@/services/builderWrite';
import { BuilderConfig, ContentQuery } from '@/types';
import { validateRequired, validateContentData } from '@/utils/validation';
import { Logger } from '@/utils/logger';

export function createContentRouter(config: BuilderConfig): Router {
  const router = Router();
  const contentService = new BuilderContentService(config);
  const writeService = new BuilderWriteService(config);

  // GET /content/:model - Get content entries
  router.get('/:model', async (req: Request, res: Response): Promise<void> => {
    try {
      const { model } = req.params;
      validateRequired(model, 'Model name');

      // Build query from request parameters
      const query: ContentQuery = {};

      if (req.query.enrich) query.enrich = req.query.enrich === 'true';
      if (req.query.fields) query.fields = req.query.fields as string;
      if (req.query.omit) query.omit = req.query.omit as string;
      if (req.query.query) query.query = req.query.query as string;
      if (req.query.sort) query.sort = req.query.sort as string;
      if (req.query.limit) query.limit = parseInt(req.query.limit as string);
      if (req.query.offset) query.offset = parseInt(req.query.offset as string);
      if (req.query.noTargeting) query.noTargeting = req.query.noTargeting === 'true';
      if (req.query.includeRefs) query.includeRefs = req.query.includeRefs === 'true';
      if (req.query.cacheSeconds) query.cacheSeconds = parseInt(req.query.cacheSeconds as string);
      if (req.query.staleCacheSeconds) query.staleCacheSeconds = parseInt(req.query.staleCacheSeconds as string);
      if (req.query.includeUnpublished) query.includeUnpublished = req.query.includeUnpublished === 'true';
      if (req.query.userAttributes) {
        try {
          query.userAttributes = JSON.parse(req.query.userAttributes as string);
        } catch (e) {
          res.status(400).json({
            success: false,
            error: 'Invalid userAttributes JSON'
          });
          return;
        }
      }

      Logger.info(`Fetching content for model: ${model}`);
      const result = await contentService.getContent(model, query);

      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error fetching content', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // GET /content/:model/:id - Get specific content entry
  router.get('/:model/:id', async (req: Request, res: Response) => {
    try {
      const { model, id } = req.params;
      validateRequired(model, 'Model name');
      validateRequired(id, 'Content ID');
      
      const query: ContentQuery = {};
      if (req.query.includeUnpublished) query.includeUnpublished = req.query.includeUnpublished === 'true';
      
      Logger.info(`Fetching content: ${model}/${id}`);
      const result = await contentService.getContentById(model, id, query);
      
      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error fetching content by ID', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // POST /content/:model - Create new content entry
  router.post('/:model', async (req: Request, res: Response) => {
    try {
      const { model } = req.params;
      const { data, name } = req.body;
      
      validateRequired(model, 'Model name');
      validateContentData(data);
      
      Logger.info(`Creating content for model: ${model}`);
      const result = await writeService.createContent(model, data, name);
      
      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error creating content', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // PUT /content/:model/:id - Update content entry
  router.put('/:model/:id', async (req: Request, res: Response) => {
    try {
      const { model, id } = req.params;
      const updates = req.body;
      
      validateRequired(model, 'Model name');
      validateRequired(id, 'Content ID');
      
      if (updates.data) {
        validateContentData(updates.data);
      }
      
      Logger.info(`Updating content: ${model}/${id}`);
      const result = await writeService.updateContent(model, id, updates);
      
      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error updating content', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // POST /content/:model/:id/publish - Publish content
  router.post('/:model/:id/publish', async (req: Request, res: Response) => {
    try {
      const { model, id } = req.params;
      
      validateRequired(model, 'Model name');
      validateRequired(id, 'Content ID');
      
      Logger.info(`Publishing content: ${model}/${id}`);
      const result = await writeService.publishContent(model, id);
      
      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error publishing content', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // POST /content/:model/:id/unpublish - Unpublish content
  router.post('/:model/:id/unpublish', async (req: Request, res: Response) => {
    try {
      const { model, id } = req.params;
      
      validateRequired(model, 'Model name');
      validateRequired(id, 'Content ID');
      
      Logger.info(`Unpublishing content: ${model}/${id}`);
      const result = await writeService.unpublishContent(model, id);
      
      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error unpublishing content', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}
