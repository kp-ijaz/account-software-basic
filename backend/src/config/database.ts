import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
export const db = prisma;
