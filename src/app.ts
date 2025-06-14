// Main Express application for Builder.io MCP

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { BuilderConfig } from '@/types';
import { createModelsRouter } from '@/routes/models';
import { createContentRouter } from '@/routes/content';
import { createUploadRouter } from '@/routes/upload';
import { createTypesRouter } from '@/routes/types';
import { Logger } from '@/utils/logger';

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateConfig(): BuilderConfig {
  const apiKey = process.env.BUILDER_API_KEY;
  const privateKey = process.env.BUILDER_PRIVATE_KEY;

  if (!apiKey) {
    throw new Error('BUILDER_API_KEY environment variable is required');
  }

  if (!privateKey) {
    throw new Error('BUILDER_PRIVATE_KEY environment variable is required');
  }

  return {
    apiKey,
    privateKey
  };
}

// Create Express app
function createApp(): express.Application {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`, {
      query: req.query,
      body: req.method !== 'GET' ? req.body : undefined
    });
    next();
  });

  // Validate configuration
  let config: BuilderConfig;
  try {
    config = validateConfig();
    Logger.info('Builder.io configuration validated successfully');
  } catch (error: any) {
    Logger.error('Configuration validation failed', error.message);
    process.exit(1);
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // API info endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'Builder.io MCP Server',
      version: '1.0.0',
      description: 'Simple Builder.io MCP for headless CMS integration with Qwik',
      endpoints: {
        models: {
          'GET /models': 'List all models',
          'GET /models/ids': 'List model IDs and names only',
          'GET /models/:id': 'Get specific model',
          'POST /models': 'Create new model',
          'PUT /models/:id': 'Update model',
          'DELETE /models/:id': 'Delete model'
        },
        content: {
          'GET /content/:model': 'Get content entries',
          'GET /content/:model/:id': 'Get specific content entry',
          'POST /content/:model': 'Create new content entry',
          'PUT /content/:model/:id': 'Update content entry',
          'POST /content/:model/:id/publish': 'Publish content',
          'POST /content/:model/:id/unpublish': 'Unpublish content'
        },
        upload: {
          'POST /upload': 'Upload file',
          'POST /upload/url': 'Upload from URL',
          'GET /upload/:id': 'Get file info',
          'DELETE /upload/:id': 'Delete file'
        },
        types: {
          'GET /generate-types': 'Generate TypeScript interfaces for all models',
          'GET /generate-types/:model': 'Generate TypeScript interface for specific model'
        }
      }
    });
  });

  // Mount routers
  app.use('/models', createModelsRouter(config));
  app.use('/content', createContentRouter(config));
  app.use('/upload', createUploadRouter(config));
  app.use('/generate-types', createTypesRouter(config));

  // Error handling middleware
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    Logger.error('Unhandled error', error);
    
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  });

  return app;
}

// Start server
function startServer() {
  const app = createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    Logger.info(`Builder.io MCP server started on port ${port}`);
    Logger.info(`Health check: http://localhost:${port}/health`);
    Logger.info(`API documentation: http://localhost:${port}/`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
  // Check if we should run in MCP mode
  const isMcpMode = process.argv.includes('--mcp') || process.env.MCP_MODE === 'true';

  if (isMcpMode) {
    Logger.info('Starting in MCP mode - use src/mcp/server.ts instead');
    process.exit(1);
  } else {
    startServer();
  }
}

export { createApp, startServer };
