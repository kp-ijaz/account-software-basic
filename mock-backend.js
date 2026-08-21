const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data
let authToken = null;
const mockSettings = {
  id: 1,
  madrasaName: 'Al-Noor Islamic Academy',
  address: '123 Main Street, City',
  phone: '+1-555-0123',
  email: 'info@alnoor.edu',
  currency: 'USD',
  financialYearStart: 1,
  financialYearEnd: 12,
  logo: null,
};

const mockTransactions = [
  {
    id: 1,
    type: 'INCOME',
    category: 'Student Fees',
    description: 'Monthly fees - August 2026',
    amount: 5000,
    paymentMethod: 'Bank',
    date: '2026-08-01',
  },
  {
    id: 2,
    type: 'EXPENSE',
    category: 'Teacher Salary',
    description: 'August salary',
    amount: 3000,
    paymentMethod: 'Bank',
    date: '2026-08-05',
  },
  {
    id: 3,
    type: 'INCOME',
    category: 'Donations',
    description: 'Generous donation',
    amount: 1000,
    paymentMethod: 'Cash',
    date: '2026-08-10',
  },
  {
    id: 4,
    type: 'EXPENSE',
    category: 'Electricity',
    description: 'Monthly electricity bill',
    amount: 500,
    paymentMethod: 'Bank',
    date: '2026-08-15',
  },
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@madrasa.local' && password === 'Admin@12345') {
    authToken = 'mock-jwt-token-' + Date.now();
    res.json({
      success: true,
      token: authToken,
      user: {
        id: 1,
        email: email,
        name: 'Administrator',
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Calculate totals
  const todayTransactions = mockTransactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getDate() === today.getDate() &&
           tDate.getMonth() === today.getMonth() &&
           tDate.getFullYear() === today.getFullYear();
  });

  const monthlyTransactions = mockTransactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === today.getMonth() &&
           tDate.getFullYear() === today.getFullYear();
  });

  const todayIncome = todayTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayExpense = todayTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = mockTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = mockTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  res.json({
    success: true,
    data: {
      summary: {
        todayIncome,
        todayExpense,
        monthlyIncome,
        monthlyExpense,
        currentBalance,
      },
      recentTransactions: mockTransactions.slice(-5),
      monthlyData: [
        { month: 'Jan', income: 5000, expense: 3500 },
        { month: 'Feb', income: 5200, expense: 3600 },
        { month: 'Mar', income: 5100, expense: 3400 },
        { month: 'Apr', income: 5300, expense: 3700 },
        { month: 'May', income: 5500, expense: 3800 },
        { month: 'Jun', income: 5400, expense: 3600 },
        { month: 'Jul', income: 5600, expense: 3900 },
        { month: 'Aug', income: 6000, expense: 3500 },
      ],
      incomeBreakdown: [
        { category: 'Student Fees', amount: 5000, percentage: 60 },
        { category: 'Donations', amount: 2000, percentage: 25 },
        { category: 'Sponsorship', amount: 800, percentage: 10 },
        { category: 'Other', amount: 200, percentage: 5 },
      ],
      expenseBreakdown: [
        { category: 'Teacher Salary', amount: 3000, percentage: 60 },
        { category: 'Electricity', amount: 500, percentage: 10 },
        { category: 'Maintenance', amount: 400, percentage: 8 },
        { category: 'Other', amount: 600, percentage: 22 },
      ],
    },
  });
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    ...mockSettings,
  });
});

app.put('/api/settings', (req, res) => {
  const { madrasaName, phone, address, currency, financialYearStart, financialYearEnd } = req.body;

  Object.assign(mockSettings, {
    madrasaName: madrasaName || mockSettings.madrasaName,
    phone: phone || mockSettings.phone,
    address: address || mockSettings.address,
    currency: currency || mockSettings.currency,
    financialYearStart: financialYearStart !== undefined ? financialYearStart : mockSettings.financialYearStart,
    financialYearEnd: financialYearEnd !== undefined ? financialYearEnd : mockSettings.financialYearEnd,
  });

  res.json({
    success: true,
    ...mockSettings,
  });
});

// Income endpoints
app.get('/api/income', (req, res) => {
  const incomeTransactions = mockTransactions.filter(t => t.type === 'INCOME');
  res.json({
    success: true,
    data: incomeTransactions,
    total: incomeTransactions.length,
  });
});

app.post('/api/income', (req, res) => {
  const newIncome = {
    id: Math.max(...mockTransactions.map(t => t.id), 0) + 1,
    type: 'INCOME',
    ...req.body,
  };
  mockTransactions.push(newIncome);
  res.json({
    success: true,
    data: newIncome,
  });
});

// Expense endpoints
app.get('/api/expense', (req, res) => {
  const expenseTransactions = mockTransactions.filter(t => t.type === 'EXPENSE');
  res.json({
    success: true,
    data: expenseTransactions,
    total: expenseTransactions.length,
  });
});

app.post('/api/expense', (req, res) => {
  const newExpense = {
    id: Math.max(...mockTransactions.map(t => t.id), 0) + 1,
    type: 'EXPENSE',
    ...req.body,
  };
  mockTransactions.push(newExpense);
  res.json({
    success: true,
    data: newExpense,
  });
});

// Day book endpoint
app.get('/api/daybook', (req, res) => {
  const daybook = mockTransactions.map(t => ({
    ...t,
    balance: 5000 - 3000, // Simplified calculation
  }));
  res.json({
    success: true,
    data: daybook,
  });
});

// Ledger endpoint
app.get('/api/ledger', (req, res) => {
  const ledger = mockTransactions.map((t, idx) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    debit: t.type === 'EXPENSE' ? t.amount : 0,
    credit: t.type === 'INCOME' ? t.amount : 0,
    balance: idx === 0 ? 5000 : 5000,
  }));
  res.json({
    success: true,
    data: ledger,
  });
});

// Balance sheet endpoint
app.get('/api/reports/balance-sheet', (req, res) => {
  const totalIncome = mockTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = mockTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  res.json({
    success: true,
    data: {
      assets: {
        cash: 5000,
        bankBalance: 7000,
        totalAssets: 12000,
      },
      liabilities: {
        pendingPayables: 1000,
        totalLiabilities: 1000,
      },
      equity: {
        openingBalance: 10000,
        currentIncome: totalIncome,
        currentExpense: totalExpense,
        netProfit: netProfit,
        totalEquity: 10000 + netProfit,
      },
      totalLiabilitiesAndEquity: 1000 + 10000 + netProfit,
      asOf: new Date().toISOString().split('T')[0],
    },
  });
});

// Audit log endpoint
app.get('/api/audit', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        action: 'LOGIN',
        description: 'Admin logged in',
        timestamp: new Date().toISOString(),
      },
    ],
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  authToken = null;
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});
