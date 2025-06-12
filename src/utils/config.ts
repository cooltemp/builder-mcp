import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
  // Server
  port: number;
  nodeEnv: string;
  
  // Builder.io
  builderPublicApiKey: string;
  builderPrivateApiKey: string;
  
  // Security
  jwtSecret: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // Logging
  logLevel: string;
  logFile: string;
  
  // Frontend
  frontendPath: string;
  
  // Scraper
  scraperUserAgent: string;
  scraperDelayMs: number;
  scraperTimeoutMs: number;
}

const config: Config = {
  // Server
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',

  // Builder.io
  builderPublicApiKey: process.env['BUILDER_PUBLIC_API_KEY'] || '',
  builderPrivateApiKey: process.env['BUILDER_PRIVATE_API_KEY'] || '',

  // Security
  jwtSecret: process.env['JWT_SECRET'] || 'default-secret-change-in-production',
  rateLimitWindowMs: parseInt(process.env['API_RATE_LIMIT_WINDOW_MS'] || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env['API_RATE_LIMIT_MAX_REQUESTS'] || '100', 10),

  // Logging
  logLevel: process.env['LOG_LEVEL'] || 'info',
  logFile: process.env['LOG_FILE'] || 'logs/app.log',

  // Frontend
  frontendPath: process.env['FRONTEND_PATH'] || '../frontend',

  // Scraper
  scraperUserAgent: process.env['SCRAPER_USER_AGENT'] || 'Mozilla/5.0 (compatible; BuilderMCP/1.0)',
  scraperDelayMs: parseInt(process.env['SCRAPER_DELAY_MS'] || '1000', 10),
  scraperTimeoutMs: parseInt(process.env['SCRAPER_TIMEOUT_MS'] || '30000', 10),
};

// Validation
export function validateConfig(): void {
  const requiredFields: (keyof Config)[] = [
    'builderPublicApiKey',
    'builderPrivateApiKey'
  ];
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
  }
}

export default config;
