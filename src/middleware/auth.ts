import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import config from '@/utils/config';
import logger from '@/utils/logger';
import { createError } from './error';

/**
 * Rate limiting middleware
 */
export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 minutes by default
  max: config.rateLimitMaxRequests, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
    });

    res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * API key authentication middleware
 */
export function authenticateApiKey(req: Request, _res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query['apiKey'];
  
  if (!apiKey) {
    logger.warn('Missing API key', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
    });

    throw createError.unauthorized('API key required. Please provide an API key in the X-API-Key header or apiKey query parameter.');
  }

  // In a real application, you would validate the API key against a database
  // For now, we'll just check if it matches the Builder.io keys
  const validApiKeys = [
    config.builderPublicApiKey,
    config.builderPrivateApiKey,
  ].filter(Boolean);

  // In test environment, also accept test API keys
  if (config.nodeEnv === 'test') {
    validApiKeys.push('test-api-key', 'test-public-key', 'test-private-key');
  }

  if (!validApiKeys.includes(apiKey as string)) {
    logger.warn('Invalid API key', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      apiKey: (apiKey as string).substring(0, 8) + '...', // Log only first 8 chars
    });

    throw createError.unauthorized('Invalid API key.');
  }

  // Store the API key in the request for later use
  req.apiKey = apiKey as string;
  
  logger.debug('API key authenticated', {
    ip: req.ip,
    url: req.url,
    method: req.method,
  });

  next();
}

/**
 * Optional authentication middleware (doesn't throw if no API key)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query['apiKey'];
  
  if (apiKey) {
    // If API key is provided, validate it
    return authenticateApiKey(req, res, next);
  }

  // No API key provided, continue without authentication
  next();
}

/**
 * Role-based access control middleware
 */
export function requireRole(role: 'admin' | 'editor' | 'viewer') {
  return (req: Request, _res: Response, next: NextFunction) => {
    // In a real application, you would decode the API key or JWT token
    // to determine the user's role. For now, we'll assume all authenticated
    // users have admin role.
    
    if (!req.apiKey) {
      throw createError.unauthorized('Authentication required for this operation.');
    }

    // Mock role checking - in production, implement proper role validation
    const userRole = 'admin'; // This would come from token/database

    const roleHierarchy = {
      viewer: 1,
      editor: 2,
      admin: 3,
    };

    if (roleHierarchy[userRole] < roleHierarchy[role]) {
      logger.warn('Insufficient permissions', {
        requiredRole: role,
        userRole,
        ip: req.ip,
        url: req.url,
        method: req.method,
      });

      throw createError.forbidden(`This operation requires ${role} role.`);
    }

    next();
  };
}

/**
 * CORS configuration for different environments
 */
export function getCorsOptions() {
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow all origins
      if (config.nodeEnv === 'development') {
        return callback(null, true);
      }

      // In production, you should specify allowed origins
      const allowedOrigins = [
        'https://builder.io',
        'https://app.builder.io',
        // Add your frontend domains here
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('CORS blocked request', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
      'X-Per-Page',
    ],
  };

  return corsOptions;
}

/**
 * Security headers middleware
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add CSP header for API responses
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none';"
  );

  next();
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
      user?: {
        id: string;
        role: 'admin' | 'editor' | 'viewer';
      };
    }
  }
}
