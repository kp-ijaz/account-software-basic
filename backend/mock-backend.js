const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production-12345';

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

const ADMIN_EMAIL = 'admin@madrasa.local';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@123456', 10);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), environment: 'development' });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = jwt.sign({ userId: 'admin-001', email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, data: { token, user: { id: 'admin-001', email: ADMIN_EMAIL, name: 'Administrator' } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      summary: { todayIncome: 5000, todayExpense: 1200, cashBalance: 45000, bankBalance: 125000, monthIncome: 95000, monthExpense: 32000 },
      recentTransactions: [],
      monthlyData: [{ month: 'Jan', income: 50000, expense: 20000 }],
      incomeBreakdown: [],
      expenseBreakdown: []
    }
  });
});

// Reports - Monthly
app.get('/api/reports/monthly', (req, res) => {
  res.json({
    success: true,
    data: { summary: { totalIncome: 95000, totalExpense: 32000, netBalance: 63000 }, transactions: [], incomeByCategory: [], expenseByCategory: [] }
  });
});

// Reports - Yearly
app.get('/api/reports/yearly', (req, res) => {
  res.json({
    success: true,
    data: { months: [], totals: { totalIncome: 200000, totalExpense: 74000, annualBalance: 126000 } }
  });
});

// Reports - Balance Sheet (FIXED STRUCTURE)
app.get('/api/reports/balance-sheet', (req, res) => {
  res.json({
    success: true,
    data: {
      assets: {
        cash: 45000,
        bankBalance: 125000,
        totalAssets: 170000
      },
      liabilities: {
        pendingPayables: 5000,
        totalLiabilities: 5000
      },
      equity: {
        openingBalance: 100000,
        currentIncome: 95000,
        currentExpense: 32000,
        netProfit: 63000,
        totalEquity: 163000
      },
      totalLiabilitiesAndEquity: 168000,
      asOf: new Date().toISOString()
    }
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    data: { id: '1', madrasaName: 'Al-Noor Madrasa', address: 'Karachi, Pakistan', phone: '+92-300-1234567', email: 'info@madrasa.local', logo: null, currency: 'PKR', financialYear: 2026 }
  });
});

// Income, Expense, Day book, Ledger, Audit log, Categories
app.get('/api/income', (req, res) => {
  res.json({ success: true, data: { items: [], total: 0, page: 1, pageSize: 50, pages: 1 } });
});

app.get('/api/expense', (req, res) => {
  res.json({ success: true, data: { items: [], total: 0, page: 1, pageSize: 50, pages: 1 } });
});

app.get('/api/daybook', (req, res) => {
  res.json({ success: true, data: { items: [], total: 0, page: 1, pageSize: 50, pages: 1 } });
});

app.get('/api/ledger', (req, res) => {
  res.json({ success: true, data: { items: [], total: 0, page: 1, pageSize: 50, pages: 1 } });
});

app.get('/api/audit-log', (req, res) => {
  res.json({ success: true, data: { items: [], total: 0, page: 1, pageSize: 50, pages: 1 } });
});

app.get('/api/income-categories', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/expense-categories', (req, res) => {
  res.json({ success: true, data: [] });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
