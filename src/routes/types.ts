// TypeScript interface generator routes

import { Router, Request, Response } from 'express';
import { BuilderAdminService } from '@/services/builderAdmin';
import { TypeGenerator } from '@/services/typeGenerator';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';

export function createTypesRouter(config: BuilderConfig): Router {
  const router = Router();
  const adminService = new BuilderAdminService(config);
  const typeGenerator = new TypeGenerator();

  // POST / - Generate TypeScript interfaces for all models (separate files)
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      Logger.info('Generating TypeScript interfaces for all models');

      const modelsResult = await adminService.getModels();

      if (!modelsResult.success) {
        res.status(modelsResult.status).json({
          success: false,
          error: modelsResult.error
        });
        return;
      }

      const models = modelsResult.data?.models || [];

      // Clean existing generated files
      await typeGenerator.cleanGeneratedDir();

      const generatedInterfaces = [];
      const interfaceNames = [];

      // Generate interface for each model
      for (const model of models) {
        try {
          const generatedInterface = typeGenerator.generateInterface(model);
          await typeGenerator.writeInterface(generatedInterface);

          generatedInterfaces.push(generatedInterface);
          interfaceNames.push(generatedInterface.name, `${generatedInterface.name}Data`);
        } catch (error) {
          Logger.error(`Error generating interface for model ${model.name}:`, error);
          // Continue with other models
        }
      }

      // Generate index file
      const indexContent = typeGenerator.generateIndexFile(generatedInterfaces);
      await typeGenerator.writeIndexFile(indexContent);

      Logger.info(`Generated ${generatedInterfaces.length} TypeScript interfaces`);

      res.json({
        success: true,
        data: {
          generatedFiles: generatedInterfaces.map(iface => iface.filePath),
          interfaceCount: generatedInterfaces.length,
          interfaces: interfaceNames,
          indexFile: 'src/types/generated/index.ts'
        }
      });
    } catch (error: any) {
      Logger.error('Error generating TypeScript interfaces', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // POST /:model - Generate TypeScript interface for specific model
  router.post('/:model', async (req: Request, res: Response): Promise<void> => {
    try {
      const { model } = req.params;
      Logger.info(`Generating TypeScript interface for model: ${model}`);

      const modelResult = await adminService.getModelByName(model);

      if (!modelResult.success) {
        res.status(modelResult.status).json({
          success: false,
          error: modelResult.error
        });
        return;
      }

      const modelData = modelResult.data;
      if (!modelData) {
        res.status(404).json({
          success: false,
          error: 'Model not found'
        });
        return;
      }

      const generatedInterface = typeGenerator.generateInterface(modelData);
      await typeGenerator.writeInterface(generatedInterface);

      Logger.info(`Generated TypeScript interface: ${generatedInterface.filePath}`);

      res.json({
        success: true,
        data: {
          filePath: generatedInterface.filePath,
          interfaceName: generatedInterface.name,
          content: generatedInterface.content
        }
      });
    } catch (error: any) {
      Logger.error('Error generating TypeScript interface', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}
