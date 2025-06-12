import app from './app';
import config from '@/utils/config';
import logger from '@/utils/logger';

const PORT = config.port;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Builder.io MCP Server started`, {
    port: PORT,
    environment: config.nodeEnv,
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
  });

  logger.info('📋 Available endpoints:', {
    health: `http://localhost:${PORT}/health`,
    docs: `http://localhost:${PORT}/`,
    models: `http://localhost:${PORT}/models`,
    content: `http://localhost:${PORT}/content`,
    types: `http://localhost:${PORT}/generate-types`,
    augment: `http://localhost:${PORT}/augment-context`,
  });

  if (config.nodeEnv === 'development') {
    logger.info('🔧 Development mode enabled', {
      logLevel: config.logLevel,
      frontendPath: config.frontendPath,
    });
  }
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
