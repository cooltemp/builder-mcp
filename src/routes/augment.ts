import { Router } from 'express';
import { augmentContextProvider } from '@/augment/context';
import { frontendFileMapper } from '@/augment/file-mapper';
import { validateRequest } from '@/middleware/validation';
import { authenticateApiKey, optionalAuth } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/error';
import logger from '@/utils/logger';
import Joi from 'joi';

const router = Router();

/**
 * GET /augment-context
 * Get comprehensive context for Augment AI
 */
router.get(
  '/',
  optionalAuth, // Allow access without API key for read-only context
  asyncHandler(async (_req, res) => {
    logger.info('Generating Augment context');

    const context = await augmentContextProvider.generateContext();

    res.json({
      success: true,
      data: context,
      message: 'Augment context generated successfully',
    });
  })
);

/**
 * GET /augment-context/models
 * Get context for specific models only
 */
router.get(
  '/models',
  optionalAuth,
  validateRequest({
    query: Joi.object({
      ids: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string())
      ).required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { ids } = req.query;
    const modelIds = Array.isArray(ids) ? ids : [ids];

    logger.info('Generating model-specific Augment context', { modelIds });

    const context = await augmentContextProvider.getModelContext(modelIds as string[]);

    res.json({
      success: true,
      data: context,
      message: `Context generated for ${modelIds.length} models`,
    });
  })
);

/**
 * GET /augment-context/frontend
 * Get frontend file structure and analysis
 */
router.get(
  '/frontend',
  optionalAuth,
  validateRequest({
    query: Joi.object({
      includeContent: Joi.boolean().default(false),
      categories: Joi.array().items(
        Joi.string().valid('components', 'pages', 'types', 'configs', 'assets')
      ).optional(),
      recentHours: Joi.number().integer().min(1).max(168).default(24), // 1 hour to 1 week
    }),
  }),
  asyncHandler(async (req, res) => {
    const { includeContent, categories, recentHours } = req.query;

    logger.info('Generating frontend context', { includeContent, categories, recentHours });

    const fileMap = await frontendFileMapper.generateFileMap();
    
    let response: any = {
      success: true,
      data: {
        fileMap,
        recentlyModified: frontendFileMapper.getRecentlyModified(
          fileMap.components.concat(fileMap.pages, fileMap.types),
          Number(recentHours)
        ),
      },
      message: 'Frontend context generated successfully',
    };

    // Include file contents if requested
    if (includeContent) {
      const keyFiles = [
        ...fileMap.configs.slice(0, 5), // Top 5 config files
        ...fileMap.types.slice(0, 10), // Top 10 type files
      ];

      const filePaths = keyFiles.map(f => f.relativePath);
      const contents = await frontendFileMapper.getFileContents(filePaths);
      
      response.data.fileContents = contents;
    }

    // Filter by categories if specified
    if (categories && Array.isArray(categories)) {
      const filteredData: any = { fileMap: { ...fileMap } };
      
      // Only include requested categories
      const allCategories = ['components', 'pages', 'types', 'configs', 'assets'];
      for (const category of allCategories) {
        if (!categories.includes(category)) {
          delete filteredData.fileMap[category];
        }
      }
      
      response.data = { ...response.data, ...filteredData };
    }

    res.json(response);
  })
);

/**
 * POST /augment-context/search
 * Search for files and content across the codebase
 */
router.post(
  '/search',
  optionalAuth,
  validateRequest({
    body: Joi.object({
      query: Joi.string().required().min(1).max(200),
      type: Joi.string().valid('files', 'content', 'models', 'all').default('all'),
      includeContent: Joi.boolean().default(false),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { query, type, includeContent, limit } = req.body;

    logger.info('Searching Augment context', { query, type, includeContent, limit });

    const results: any = {
      files: [],
      content: [],
      models: [],
    };

    // Search files
    if (type === 'files' || type === 'all') {
      try {
        const fileMap = await frontendFileMapper.generateFileMap();
        const allFiles = [
          ...fileMap.components,
          ...fileMap.pages,
          ...fileMap.types,
          ...fileMap.configs,
        ];

        results.files = frontendFileMapper.searchFiles(query, allFiles)
          .slice(0, Number(limit));

        if (includeContent && results.files.length > 0) {
          const filePaths = results.files.map((f: any) => f.relativePath);
          const contents = await frontendFileMapper.getFileContents(filePaths);
          
          results.files = results.files.map((file: any) => ({
            ...file,
            content: contents[file.relativePath],
          }));
        }
      } catch (error) {
        logger.warn('Failed to search files', error);
      }
    }

    // Search models and content
    if (type === 'models' || type === 'content' || type === 'all') {
      try {
        const context = await augmentContextProvider.generateContext();
        
        // Search models
        if (type === 'models' || type === 'all') {
          const regex = new RegExp(query, 'i');
          results.models = context.models.items
            .filter(model => 
              regex.test(model.name) || 
              regex.test(model.meta?.description || '') ||
              model.fields.some(field => regex.test(field.name) || regex.test(field.helperText || ''))
            )
            .slice(0, Number(limit));
        }

        // Search content
        if (type === 'content' || type === 'all') {
          const regex = new RegExp(query, 'i');
          const contentResults: any[] = [];

          for (const [modelId, modelContent] of Object.entries(context.content.byModel)) {
            const model = context.models.byId[modelId];
            if (!model) continue;

            const matchingContent = modelContent.samples.filter((content: any) =>
              regex.test(content.name) ||
              regex.test(JSON.stringify(content.data))
            );

            contentResults.push(...matchingContent.map((content: any) => ({
              ...content,
              modelName: model.name,
              modelId: model.id,
            })));
          }

          results.content = contentResults.slice(0, Number(limit));
        }
      } catch (error) {
        logger.warn('Failed to search models/content', error);
      }
    }

    const totalResults = results.files.length + results.content.length + results.models.length;

    res.json({
      success: true,
      data: {
        query,
        totalResults,
        results,
      },
      message: `Found ${totalResults} results for "${query}"`,
    });
  })
);

/**
 * GET /augment-context/summary
 * Get a quick summary of the current state
 */
router.get(
  '/summary',
  optionalAuth,
  asyncHandler(async (_req, res) => {
    logger.info('Generating Augment context summary');

    try {
      const context = await augmentContextProvider.generateContext();

      const summary = {
        models: {
          total: context.models.count,
          withContent: Object.values(context.content.byModel)
            .filter(m => m.count > 0).length,
          withoutContent: context.relationships.unusedModels.length,
        },
        content: {
          total: context.content.totalEntries,
          published: Object.values(context.content.byModel)
            .reduce((sum, m) => sum + m.published, 0),
          draft: Object.values(context.content.byModel)
            .reduce((sum, m) => sum + m.draft, 0),
        },
        types: {
          generated: context.types.count,
          missing: context.suggestions.missingTypes.length,
        },
        frontend: {
          hasFileMap: context.frontend.hasPath,
          totalFiles: context.frontend.fileMap?.summary.totalFiles || 0,
          components: context.frontend.fileMap?.components.length || 0,
          pages: context.frontend.fileMap?.pages.length || 0,
        },
        suggestions: {
          total: context.suggestions.missingTypes.length + 
                 context.suggestions.outdatedContent.length + 
                 context.suggestions.optimizations.length,
          missingTypes: context.suggestions.missingTypes.length,
          outdatedContent: context.suggestions.outdatedContent.length,
          optimizations: context.suggestions.optimizations.length,
        },
        lastGenerated: context.metadata.generatedAt,
      };

      res.json({
        success: true,
        data: summary,
        message: 'Context summary generated successfully',
      });
    } catch (error) {
      logger.error('Failed to generate context summary', error);
      
      // Return basic summary even if full context fails
      res.json({
        success: false,
        data: {
          error: 'Failed to generate full context',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        message: 'Context summary generation failed',
      });
    }
  })
);

/**
 * POST /augment-context/refresh
 * Force refresh of cached context data
 */
router.post(
  '/refresh',
  authenticateApiKey,
  asyncHandler(async (_req, res) => {
    logger.info('Refreshing Augment context');

    // Force regeneration of all context data
    const context = await augmentContextProvider.generateContext();

    res.json({
      success: true,
      data: {
        refreshedAt: new Date().toISOString(),
        summary: {
          models: context.models.count,
          content: context.content.totalEntries,
          types: context.types.count,
          frontend: !!context.frontend.fileMap,
        },
      },
      message: 'Augment context refreshed successfully',
    });
  })
);

export default router;
