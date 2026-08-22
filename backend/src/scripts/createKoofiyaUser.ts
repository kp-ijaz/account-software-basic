import prisma from '../config/database';
import userService from '../services/userService';
import logger from '../utils/logger';

async function createKoofiyaUser() {
  try {
    logger.info('Creating koofiya user...');

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'koofiya@admin.com' },
    });

    if (existing) {
      logger.info('✅ User koofiya@admin.com already exists');
      await prisma.$disconnect();
      return;
    }

    // Create the user
    const user = await userService.createUser({
      email: 'koofiya@admin.com',
      username: 'koofiya',
      password: 'Koofiya1234',
    });

    logger.info('✅ User created successfully!');
    logger.info(`Email: koofiya@admin.com`);
    logger.info(`Password: Koofiya1234`);
    logger.info(`Username: ${user.username}`);

    await prisma.$disconnect();
  } catch (error) {
    logger.error('❌ Failed to create user', error as Error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createKoofiyaUser();
