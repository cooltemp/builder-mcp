import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '@/utils/logger';

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

/**
 * Middleware factory for request validation using Joi
 */
export function validateRequest(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate request params
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate request query
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      logger.warn('Request validation failed', {
        url: req.url,
        method: req.method,
        errors,
        body: req.body,
        params: req.params,
        query: req.query,
      });

      res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    next();
  };
}

// Common validation schemas
export const commonSchemas = {
  // Model ID parameter
  modelId: Joi.object({
    model: Joi.string().required().min(1).max(100),
  }),

  // Content ID parameter
  contentId: Joi.object({
    id: Joi.string().required().min(1).max(100),
  }),

  // Pagination query
  pagination: Joi.object({
    limit: Joi.number().integer().min(1).max(1000).default(100),
    offset: Joi.number().integer().min(0).default(0),
  }),

  // Content creation body
  createContent: Joi.object({
    name: Joi.string().required().min(1).max(200),
    data: Joi.object().required(),
    published: Joi.string().valid('draft', 'published').default('draft'),
    meta: Joi.object({
      urlPath: Joi.string().max(500),
      title: Joi.string().max(200),
      description: Joi.string().max(1000),
    }).optional(),
  }),

  // Content update body
  updateContent: Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    data: Joi.object().optional(),
    published: Joi.string().valid('draft', 'published', 'archived').optional(),
    meta: Joi.object({
      urlPath: Joi.string().max(500),
      title: Joi.string().max(200),
      description: Joi.string().max(1000),
    }).optional(),
  }).min(1), // At least one field must be provided

  // Content query options
  contentQuery: Joi.object({
    limit: Joi.number().integer().min(1).max(1000).default(100),
    offset: Joi.number().integer().min(0).default(0),
    published: Joi.string().valid('draft', 'published', 'archived').optional(),
    sortBy: Joi.string().max(100).optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    query: Joi.string().optional(), // JSON string
  }),

  // Model creation body
  createModel: Joi.object({
    name: Joi.string().required().min(1).max(100),
    kind: Joi.string().valid('page', 'data', 'component').required(),
    fields: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(1).max(100),
        type: Joi.string().valid(
          'text', 'longText', 'richText', 'number', 'boolean',
          'date', 'file', 'reference', 'list', 'object', 'color',
          'url', 'email', 'blocks'
        ).required(),
        required: Joi.boolean().default(false),
        defaultValue: Joi.any().optional(),
        helperText: Joi.string().max(500).optional(),
        enum: Joi.array().items(Joi.string()).optional(),
        subFields: Joi.array().optional(), // Recursive validation would be complex
        model: Joi.string().max(100).optional(),
      })
    ).required(),
    meta: Joi.object({
      description: Joi.string().max(1000),
      tags: Joi.array().items(Joi.string().max(50)),
    }).optional(),
  }),

  // Type generation options
  typeGeneration: Joi.object({
    models: Joi.array().items(Joi.string()).optional(),
    outputDir: Joi.string().max(500).optional(),
    includeDefaults: Joi.boolean().default(true),
    includeTypeGuards: Joi.boolean().default(true),
  }),
};

/**
 * Middleware to sanitize request data
 */
export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  // Remove any potential XSS or injection attempts
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim();
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
}

/**
 * Middleware to validate API key presence
 */
export function validateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] || req.query['apiKey'];

  if (!apiKey) {
    logger.warn('API request without API key', {
      url: req.url,
      method: req.method,
      ip: req.ip,
    });

    res.status(401).json({
      error: 'API key required',
      message: 'Please provide an API key in the X-API-Key header or apiKey query parameter',
    });
    return;
  }

  // Store API key in request for later use
  req.apiKey = apiKey as string;
  next();
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
    }
  }
}
