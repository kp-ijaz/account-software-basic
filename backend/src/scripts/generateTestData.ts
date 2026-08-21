import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Generate test data for performance testing
 * Creates 1000+ transactions across multiple months
 *
 * Usage: npx ts-node src/scripts/generateTestData.ts
 */

const INCOME_CATEGORIES = [
  'Student Fees',
  'Donations',
  'Zakat',
  'Sadaqah',
  'Sponsorship',
  'Building Fund',
  'Other Income',
];

const EXPENSE_CATEGORIES = [
  'Teacher Salary',
  'Electricity',
  'Water',
  'Food',
  'Maintenance',
  'Stationery',
  'Events',
  'Building Maintenance',
  'Miscellaneous',
];

async function generateTestData() {
  try {
    console.log('🔄 Starting test data generation...');
    const startTime = Date.now();

    // Clear existing data (if any)
    console.log('🗑️  Clearing existing data...');
    await prisma.auditLog.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.incomeCategory.deleteMany({});
    await prisma.expenseCategory.deleteMany({});

    // Setup categories first
    console.log('📁 Creating categories...');
    const incomeCategories = await Promise.all(
      INCOME_CATEGORIES.map((name, idx) =>
        prisma.incomeCategory.create({
          data: { name, isDefault: idx === 0, order: idx },
        })
      )
    );

    const expenseCategories = await Promise.all(
      EXPENSE_CATEGORIES.map((name, idx) =>
        prisma.expenseCategory.create({
          data: { name, isDefault: idx === 0, order: idx },
        })
      )
    );

    // Ensure admin user exists
    console.log('👤 Setting up admin user...');
    const adminEmail = 'admin@madrasa.local';
    const hashedPassword = await hash('Admin@12345', 12);

    let admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          username: 'admin',
          passwordHash: hashedPassword,
        },
      });
    }

    console.log(`✅ Admin user: ${admin.id}`);

    // Generate transactions for 12 months
    console.log('💰 Generating transactions...');
    let incomeCount = 0;
    let expenseCount = 0;
    const currentYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      // Generate 40-50 income transactions per month
      const incomePerMonth = Math.floor(Math.random() * 10) + 40;
      for (let i = 0; i < incomePerMonth; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(currentYear, month - 1, day);
        const amount = parseFloat((Math.random() * 5000 + 100).toFixed(2));
        const categoryIdx = Math.floor(Math.random() * incomeCategories.length);

        await prisma.transaction.create({
          data: {
            type: 'INCOME',
            date,
            incomeCategoryId: incomeCategories[categoryIdx].id,
            description: `Income: ${incomeCategories[categoryIdx].name}`,
            amount,
            paymentMethod: Math.random() > 0.5 ? 'CASH' : 'BANK',
          },
        });

        incomeCount++;
      }

      // Generate 30-40 expense transactions per month
      const expensePerMonth = Math.floor(Math.random() * 10) + 30;
      for (let i = 0; i < expensePerMonth; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(currentYear, month - 1, day);
        const amount = parseFloat((Math.random() * 3000 + 50).toFixed(2));
        const categoryIdx = Math.floor(Math.random() * expenseCategories.length);

        await prisma.transaction.create({
          data: {
            type: 'EXPENSE',
            date,
            expenseCategoryId: expenseCategories[categoryIdx].id,
            description: `Expense: ${expenseCategories[categoryIdx].name}`,
            amount,
            paymentMethod: Math.random() > 0.5 ? 'CASH' : 'BANK',
          },
        });

        expenseCount++;
      }

      // Log progress
      const progress = Math.round((month / 12) * 100);
      console.log(`  Month ${month}/12 (${progress}%) - Generated transactions`);
    }

    const totalTransactions = incomeCount + expenseCount;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('✅ Test Data Generation Complete!');
    console.log(`   Income Transactions:  ${incomeCount}`);
    console.log(`   Expense Transactions: ${expenseCount}`);
    console.log(`   Total Transactions:   ${totalTransactions}`);
    console.log(`   Duration:             ${duration}s`);
    console.log('');
    console.log('📊 Ready for performance testing!');
    console.log('   Use these commands to test:');
    console.log('   - npm run test:performance');
    console.log('   - npm run test:load');
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateTestData();
