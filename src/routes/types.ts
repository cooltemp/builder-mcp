import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { builderAdminApi } from '@/builder/admin-api';
import { typeScriptGenerator } from '@/types/generator';
import { validateRequest, commonSchemas } from '@/middleware/validation';
import { authenticateApiKey, requireRole } from '@/middleware/auth';
import { asyncHandler, createError } from '@/middleware/error';
import logger from '@/utils/logger';

const router = Router();

/**
 * GET /generate-types
 * Generate TypeScript interfaces for all or specific models
 */
router.get(
  '/',
  authenticateApiKey,
  validateRequest({
    query: commonSchemas.typeGeneration,
  }),
  asyncHandler(async (req, res) => {
    const { models: modelIds, outputDir, includeDefaults, includeTypeGuards } = req.query;

    logger.info('Generating TypeScript interfaces', { 
      modelIds, 
      outputDir, 
      includeDefaults, 
      includeTypeGuards 
    });

    // Fetch models
    let models;
    if (modelIds && Array.isArray(modelIds)) {
      // Generate types for specific models
      models = [];
      for (const modelId of modelIds) {
        try {
          const model = await builderAdminApi.getModel(modelId as string);
          models.push(model);
        } catch (error: any) {
          if (error.code === '404') {
            throw createError.notFound(`Model with ID '${modelId}' not found`);
          }
          throw error;
        }
      }
    } else {
      // Generate types for all models
      models = await builderAdminApi.getModels({ includeFields: true });
    }

    if (models.length === 0) {
      throw createError.notFound('No models found to generate types for');
    }

    // Generate TypeScript interfaces
    const generatedTypes = await typeScriptGenerator.generateAllTypes(models);

    res.json({
      success: true,
      data: {
        generated: generatedTypes.length,
        types: generatedTypes,
        outputDirectory: typeScriptGenerator['outputDir'], // Access private property
      },
      message: `Generated TypeScript interfaces for ${generatedTypes.length} models`,
    });
  })
);

/**
 * GET /generate-types/:model
 * Generate TypeScript interface for a specific model
 */
router.get(
  '/:model',
  authenticateApiKey,
  validateRequest({
    params: commonSchemas.modelId,
  }),
  asyncHandler(async (req, res) => {
    const { model: modelId } = req.params;

    logger.info('Generating TypeScript interface for model', { modelId });

    try {
      const model = await builderAdminApi.getModel(modelId as string);
      const typeInfo = await typeScriptGenerator.generateModelType(model);

      res.json({
        success: true,
        data: typeInfo,
        message: `Generated TypeScript interface for model '${model.name}'`,
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
 * GET /download-types
 * Download generated TypeScript files as a ZIP archive
 */
router.get(
  '/download',
  authenticateApiKey,
  asyncHandler(async (_req, res) => {
    const outputDir = typeScriptGenerator['outputDir'];
    
    if (!fs.existsSync(outputDir)) {
      throw createError.notFound('No generated types found. Please generate types first.');
    }

    const files = fs.readdirSync(outputDir).filter(file => file.endsWith('.ts'));
    
    if (files.length === 0) {
      throw createError.notFound('No TypeScript files found. Please generate types first.');
    }

    logger.info('Preparing TypeScript files for download', { fileCount: files.length });

    // For now, return file list and contents
    // In production, you might want to create a ZIP file
    const fileContents = files.map(fileName => {
      const filePath = path.join(outputDir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        fileName,
        content,
        size: content.length,
      };
    });

    res.json({
      success: true,
      data: {
        files: fileContents,
        totalFiles: files.length,
        totalSize: fileContents.reduce((sum, file) => sum + file.size, 0),
      },
      message: `Prepared ${files.length} TypeScript files for download`,
    });
  })
);

/**
 * GET /download-types/:filename
 * Download a specific generated TypeScript file
 */
router.get(
  '/download/:filename',
  authenticateApiKey,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;
    
    if (!filename || !filename.endsWith('.ts')) {
      throw createError.badRequest('Filename must end with .ts extension');
    }

    const outputDir = typeScriptGenerator['outputDir'];
    const filePath = path.join(outputDir, filename as string);

    if (!fs.existsSync(filePath)) {
      throw createError.notFound(`File '${filename}' not found`);
    }

    logger.info('Downloading TypeScript file', { filename });

    // Set headers for file download
    res.setHeader('Content-Type', 'text/typescript');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  })
);

/**
 * POST /validate-types
 * Validate generated TypeScript interfaces
 */
router.post(
  '/validate',
  authenticateApiKey,
  asyncHandler(async (_req, res) => {
    const outputDir = typeScriptGenerator['outputDir'];
    
    if (!fs.existsSync(outputDir)) {
      throw createError.notFound('No generated types found. Please generate types first.');
    }

    logger.info('Validating generated TypeScript interfaces');

    const files = fs.readdirSync(outputDir).filter(file => file.endsWith('.ts'));
    const validationResults = [];

    for (const fileName of files) {
      const filePath = path.join(outputDir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Basic validation - check for syntax errors
      const validation = {
        fileName,
        valid: true,
        errors: [] as string[],
        warnings: [] as string[],
      };

      // Check for common issues
      if (!content.includes('export interface')) {
        validation.valid = false;
        validation.errors.push('No exported interfaces found');
      }

      if (content.includes('any[]') || content.includes(': any')) {
        validation.warnings.push('Contains "any" types - consider more specific typing');
      }

      if (!content.includes('/**')) {
        validation.warnings.push('Missing JSDoc comments');
      }

      validationResults.push(validation);
    }

    const hasErrors = validationResults.some(r => !r.valid);
    const totalWarnings = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);

    res.json({
      success: !hasErrors,
      data: {
        filesValidated: files.length,
        validFiles: validationResults.filter(r => r.valid).length,
        invalidFiles: validationResults.filter(r => !r.valid).length,
        totalWarnings,
        results: validationResults,
      },
      message: hasErrors 
        ? 'Validation completed with errors' 
        : `All ${files.length} files validated successfully`,
    });
  })
);

/**
 * DELETE /types
 * Clear all generated TypeScript files
 */
router.delete(
  '/',
  authenticateApiKey,
  requireRole('admin'),
  asyncHandler(async (_req, res) => {
    const outputDir = typeScriptGenerator['outputDir'];
    
    if (!fs.existsSync(outputDir)) {
      res.json({
        success: true,
        message: 'No generated types to clear',
      });
      return;
    }

    logger.info('Clearing generated TypeScript files');

    const files = fs.readdirSync(outputDir);
    let deletedCount = 0;

    for (const fileName of files) {
      if (fileName.endsWith('.ts')) {
        const filePath = path.join(outputDir, fileName);
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }

    res.json({
      success: true,
      data: {
        deletedFiles: deletedCount,
      },
      message: `Cleared ${deletedCount} generated TypeScript files`,
    });
  })
);

/**
 * GET /types/info
 * Get information about generated types
 */
router.get(
  '/info',
  authenticateApiKey,
  asyncHandler(async (_req, res) => {
    const outputDir = typeScriptGenerator['outputDir'];
    
    if (!fs.existsSync(outputDir)) {
      res.json({
        success: true,
        data: {
          hasGeneratedTypes: false,
          fileCount: 0,
          files: [],
        },
        message: 'No generated types found',
      });
      return;
    }

    const files = fs.readdirSync(outputDir).filter(file => file.endsWith('.ts'));
    const fileInfo = files.map(fileName => {
      const filePath = path.join(outputDir, fileName);
      const stats = fs.statSync(filePath);
      return {
        fileName,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    });

    res.json({
      success: true,
      data: {
        hasGeneratedTypes: files.length > 0,
        fileCount: files.length,
        files: fileInfo,
        outputDirectory: outputDir,
      },
      message: `Found ${files.length} generated TypeScript files`,
    });
  })
);

export default router;
