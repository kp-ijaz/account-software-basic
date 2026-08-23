import prisma from './config/database';
import userService from './services/userService';
import logger from './utils/logger';

async function seed() {
  try {
    logger.info('🌱 Starting database seed...');

    // Create default admin user
    const adminEmail = 'admin@madrasa.local';
    const adminUsername = 'admin';
    const adminPassword = 'Admin@123456'; // Should be changed on first login

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ email: adminEmail }, { username: adminUsername }],
      },
    });

    if (existingAdmin) {
      logger.info('✅ Admin user already exists');
    } else {
      // Create admin user
      await userService.createUser({
        email: adminEmail,
        username: adminUsername,
        password: adminPassword,
      });
      logger.info('✅ Admin user created successfully');
    }

    // Create default income categories
    const incomeCategories = [
      { name: 'Student Fees', description: 'Fees from students' },
      { name: 'Donations', description: 'Donations received' },
      { name: 'Zakat', description: 'Zakat contributions' },
      { name: 'Sadaqah', description: 'Sadaqah contributions' },
      { name: 'Sponsorship', description: 'Sponsorship funds' },
      { name: 'Building Fund', description: 'Building maintenance fund' },
      { name: 'Other Income', description: 'Other income sources' },
    ];

    for (const category of incomeCategories) {
      const existing = await prisma.incomeCategory.findUnique({
        where: { name: category.name },
      });

      if (!existing) {
        await prisma.incomeCategory.create({
          data: {
            name: category.name,
            description: category.description,
            isDefault: true,
            isActive: true,
          },
        });
      }
    }

    logger.info('✅ Income categories seeded');

    // Create default expense categories
    const expenseCategories = [
      { name: 'Teacher Salary', description: 'Teacher salaries' },
      { name: 'Electricity', description: 'Electricity bills' },
      { name: 'Water', description: 'Water bills' },
      { name: 'Food', description: 'Food and catering' },
      { name: 'Maintenance', description: 'Building maintenance' },
      { name: 'Stationery', description: 'Stationery and supplies' },
      { name: 'Events', description: 'Event expenses' },
      { name: 'Building Maintenance', description: 'Building repair and maintenance' },
      { name: 'Miscellaneous', description: 'Miscellaneous expenses' },
    ];

    for (const category of expenseCategories) {
      const existing = await prisma.expenseCategory.findUnique({
        where: { name: category.name },
      });

      if (!existing) {
        await prisma.expenseCategory.create({
          data: {
            name: category.name,
            description: category.description,
            isDefault: true,
            isActive: true,
          },
        });
      }
    }

    logger.info('✅ Expense categories seeded');

    // Create default settings
    const existingSettings = await prisma.settings.findFirst();

    if (!existingSettings) {
      await prisma.settings.create({
        data: {
          madrasaName: 'Madrasa',
          currency: 'INR',
          currencySymbol: '₹',
          financialYearStart: 1,
          openingBalance: 0,
        },
      });
      logger.info('✅ Settings created');
    } else {
      logger.info('✅ Settings already exist');
    }

    logger.info('✅ Database seed completed successfully!');
    logger.info('');
    logger.info('='.repeat(50));
    logger.info('Admin Login Credentials:');
    logger.info(`Email: ${adminEmail}`);
    logger.info(`Password: ${adminPassword}`);
    logger.info('='.repeat(50));
    logger.info('⚠️  IMPORTANT: Change this password after first login!');
  } catch (error) {
    logger.error('❌ Seed failed', error as Error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
