import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { validateConfig } from '@/utils/config';
import logger, { logRequest } from '@/utils/logger';
import { 
  errorHandler, 
  notFoundHandler, 
  setupGlobalErrorHandlers,
  asyncHandler 
} from '@/middleware/error';
import { 
  rateLimiter, 
  getCorsOptions, 
  securityHeaders 
} from '@/middleware/auth';
import { sanitizeRequest } from '@/middleware/validation';

// Import routes
import modelsRouter from '@/routes/models';
import contentRouter from '@/routes/content';
import typesRouter from '@/routes/types';
import augmentRouter from '@/routes/augment';
import augmentToolsRouter from '@/routes/augment-tools';

// Validate configuration on startup
validateConfig();

// Setup global error handlers
setupGlobalErrorHandlers();

// Create Express app
const app = express();

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors(getCorsOptions()));

// Security headers
app.use(securityHeaders);

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true,
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
}));

// Request sanitization
app.use(sanitizeRequest);

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logRequest(req, res, responseTime);
  });
  
  next();
});

// Health check endpoint
app.get('/health', asyncHandler(async (_req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
    version: process.env['npm_package_version'] || '1.0.0',
    memory: process.memoryUsage(),
    checks: {
      builderApi: true, // Could add actual API health checks here
      database: true,   // Could add database health checks here
      filesystem: true, // Could add filesystem health checks here
    },
  };

  res.json(healthCheck);
}));

// API documentation endpoint
app.get('/', asyncHandler(async (_req, res) => {
  const apiInfo = {
    name: 'Builder.io MCP Server',
    version: '1.0.0',
    description: 'A secure, well-structured MCP server for interfacing with Builder.io Admin and Content APIs',
    documentation: {
      endpoints: {
        models: {
          'GET /models': 'Fetch all Builder.io models',
          'GET /models/:model': 'Fetch a specific model',
          'POST /models': 'Create a new model',
          'PUT /models/:model': 'Update a model',
          'DELETE /models/:model': 'Delete a model',
        },
        content: {
          'GET /content/:model': 'Get content entries for a model',
          'GET /content/:model/:id': 'Get a specific content entry',
          'POST /content/:model': 'Create new content entry',
          'PUT /content/:model/:id': 'Update content entry',
          'DELETE /content/:model/:id': 'Delete content entry',
          'POST /content/:model/:id/publish': 'Publish content entry',
          'POST /content/:model/:id/unpublish': 'Unpublish content entry',
        },
        types: {
          'GET /generate-types': 'Generate TypeScript interfaces',
          'GET /generate-types/:model': 'Generate interface for specific model',
          'GET /download-types': 'Download all generated types',
          'GET /download-types/:filename': 'Download specific type file',
        },
        augment: {
          'GET /augment-context': 'Get comprehensive context for Augment AI',
          'GET /augment-context/models': 'Get context for specific models',
          'GET /augment-context/frontend': 'Get frontend file structure',
          'POST /augment-context/search': 'Search across codebase',
        },
      },
      authentication: {
        method: 'API Key',
        header: 'X-API-Key',
        queryParam: 'apiKey',
        description: 'Use your Builder.io API key for authentication',
      },
      rateLimit: {
        window: '15 minutes',
        maxRequests: 100,
        description: 'Rate limiting is applied per IP address',
      },
    },
    links: {
      builderIo: 'https://builder.io',
      documentation: 'https://www.builder.io/c/docs',
      apiDocs: 'https://www.builder.io/c/docs/developers',
    },
  };

  res.json(apiInfo);
}));

// API routes
app.use('/models', modelsRouter);
app.use('/content', contentRouter);
app.use('/generate-types', typesRouter);
app.use('/augment-context', augmentRouter);
app.use('/augment-tools', augmentToolsRouter);
app.use('/augment-tools', augmentToolsRouter);

// Backwards compatibility routes
app.use('/types', typesRouter); // Alternative path for type generation

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, starting graceful shutdown`);
  
  // Close server
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
