// Model management routes

import { Router, Request, Response } from 'express';
import { BuilderAdminService } from '@/services/builderAdmin';
import { BuilderConfig } from '@/types';
import { validateRequired, validateModelName } from '@/utils/validation';
import { Logger } from '@/utils/logger';

export function createModelsRouter(config: BuilderConfig): Router {
  const router = Router();
  const adminService = new BuilderAdminService(config);

  // GET /models/schema - Introspect GraphQL schema
  router.get('/schema', async (req: Request, res: Response) => {
    try {
      Logger.info('Introspecting GraphQL schema');
      const result = await adminService.introspectSchema();

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
      Logger.error('Error introspecting schema', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // GET /models/ids - List model IDs and names only
  router.get('/ids', async (req: Request, res: Response) => {
    try {
      Logger.info('Fetching model IDs and names');
      const result = await adminService.getModelIds();

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
      Logger.error('Error fetching model IDs', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // GET /models - List all models
  router.get('/', async (req: Request, res: Response) => {
    try {
      Logger.info('Fetching all models');
      const result = await adminService.getModels();

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
      Logger.error('Error fetching models', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // GET /models/:id - Get specific model
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      validateRequired(id, 'Model ID');
      
      Logger.info(`Fetching model: ${id}`);
      const result = await adminService.getModel(id);
      
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
      Logger.error('Error fetching model', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // POST /models - Create new model
  router.post('/', async (req: Request, res: Response) => {
    try {
      const modelData = req.body;
      
      validateRequired(modelData.name, 'Model name');
      validateModelName(modelData.name);
      
      Logger.info(`Creating model: ${modelData.name}`);
      const result = await adminService.createModel(modelData);
      
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
      Logger.error('Error creating model', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // PUT /models/:id - Update model
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      validateRequired(id, 'Model ID');
      
      if (updates.name) {
        validateModelName(updates.name);
      }
      
      Logger.info(`Updating model: ${id}`);
      const result = await adminService.updateModel(id, updates);
      
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
      Logger.error('Error updating model', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // DELETE /models/:id - Delete model
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      validateRequired(id, 'Model ID');
      
      Logger.info(`Deleting model: ${id}`);
      const result = await adminService.deleteModel(id);
      
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
      Logger.error('Error deleting model', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}
