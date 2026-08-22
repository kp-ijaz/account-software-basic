import app from './app';
import env from './config/env';
import logger from './utils/logger';
import prisma from './config/database';

const startServer = async () => {
  try {
    // Test database connection (optional - don't crash if it fails)
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('✅ Database connected successfully');
    } catch (dbError) {
      logger.warn('⚠️ Database connection failed, starting anyway');
      logger.warn(dbError);
    }

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`✅ Server running on port ${env.PORT}`);
      logger.info(`📡 API: http://localhost:${env.PORT}/api`);
      logger.info(`🏥 Health: http://localhost:${env.PORT}/api/health`);
      logger.info(`🔧 Environment: ${env.NODE_ENV}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(
          `Port ${env.PORT} is already in use. Please use a different port.`
        );
      } else {
        logger.error('Server error', error);
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Start the server
startServer();
