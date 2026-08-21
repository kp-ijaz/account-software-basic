# Testing Strategy & Implementation

**Madrasa Accounting Software - MERN Stack**

---

## Overview

This document outlines the comprehensive testing strategy for the Madrasa Accounting Software, covering unit tests, integration tests, database tests, and end-to-end scenarios.

**Phase:** 14 (Complete Testing Suite)
**Status:** In Progress
**Target Coverage:** 80%+

---

## Testing Pyramid

```
                  /\
                 /  \
                /E2E \         (5-10% of tests)
               /______\
              /        \
             /Integration\  (15-25% of tests)
            /____________\
           /              \
          /     Unit       \ (65-75% of tests)
         /________________\
```

---

## Testing Layers

### 1. Unit Tests (65-75%)

**What to Test:**
- Individual functions and methods
- Validators (email, password, amount, date, phone)
- Utilities (JWT, password hashing, error handling)
- Business logic (calculations, aggregations)

**Example: Validation Tests**
```typescript
// Validate email format
validateEmail('test@example.com') → true
validateEmail('invalid-email') → false

// Validate password strength
validatePassword('Weak') → false (missing requirements)
validatePassword('Strong123!') → true

// Validate financial amount
validateAmount(100.50) → true
validateAmount(0) → false
validateAmount(-50) → false
```

**Testing Framework:** Jest

**Running:**
```bash
npm test
npm test -- --watch
npm test -- --coverage
```

### 2. Integration Tests (15-25%)

**What to Test:**
- Service layer (combining multiple functions)
- API endpoints (full request/response cycle)
- Database interactions (queries, transactions)
- Authentication flow (login, token verification, logout)

**Example: Income CRUD Integration**
```typescript
test('create income transaction → stored in db → appears in list', () => {
  // 1. Create income
  const income = await incomeService.create({
    date: '2026-08-22',
    category: 'Student Fees',
    amount: 1000,
    description: 'Fee payment',
    paymentMethod: 'BANK',
  });

  // 2. Verify stored in database
  expect(income.id).toBeDefined();
  expect(income.amount).toBe(1000);

  // 3. Verify appears in list
  const list = await incomeService.getList(1, 50);
  expect(list.items).toContainEqual(expect.objectContaining({ id: income.id }));

  // 4. Verify audit log created
  const audit = await auditService.getAuditLogs();
  expect(audit).toContainEqual(expect.objectContaining({
    action: 'INCOME_CREATED',
    recordId: income.id,
  }));
});
```

**Testing Framework:** Jest + Supertest (for API endpoints)

### 3. Database Transaction Tests (5-10%)

**What to Test:**
- Atomicity (all or nothing)
- Data consistency
- Constraint enforcement
- Cascade operations
- Rollback on failure

**Example: Transaction Atomicity**
```typescript
test('income creation rolls back on error', async () => {
  const initialCount = await prisma.transaction.count();

  try {
    // Create income with invalid data
    await createIncome({
      amount: -100, // Invalid
    });
  } catch (error) {
    // Expected to fail
  }

  // Verify no partial record created
  const finalCount = await prisma.transaction.count();
  expect(finalCount).toBe(initialCount);
});
```

### 4. End-to-End Tests (5-10%)

**What to Test:**
- Complete user workflows
- Frontend to backend integration
- UI interactions
- Real browser environment

**Example: Complete Income Workflow**
```typescript
test('Admin: Login → Add Income → View in Day Book → Verify Audit', async () => {
  // 1. Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@madrasa.local');
  await page.fill('input[type="password"]', 'Admin@12345');
  await page.click('button:has-text("Login")');
  await page.waitForNavigation();

  // 2. Navigate to Income page
  await page.click('text=Income');
  
  // 3. Add income
  await page.click('button:has-text("Add Income")');
  await page.fill('input[name="amount"]', '5000');
  await page.selectOption('select[name="category"]', 'Student Fees');
  await page.click('button:has-text("Save")');
  
  // 4. Verify in Day Book
  await page.click('text=Day Book');
  await expect(page).toContainText('Student Fees');
  await expect(page).toContainText('5000');
  
  // 5. Verify in Audit Log
  await page.click('text=Audit Log');
  await expect(page).toContainText('INCOME_CREATED');
});
```

---

## Unit Tests Implemented

### Validation Tests (`validation.test.ts`)
- ✅ Email validation (format, length)
- ✅ Password validation (strength requirements)
- ✅ Phone validation (international format)
- ✅ Amount validation (decimal, range)
- ✅ Date validation (ISO 8601 format)
- ✅ String length validation

**Coverage:** 8 test suites, 40+ test cases

### Authentication Tests (`auth.test.ts`)
- ✅ Password hashing (bcryptjs)
- ✅ Password verification
- ✅ JWT generation
- ✅ JWT verification
- ✅ Token expiration (24 hours)
- ✅ Error handling

**Coverage:** 6 test suites, 25+ test cases

---

## Unit Tests to Implement

### Service Layer Tests

#### Income Service Tests
```typescript
describe('IncomeService', () => {
  test('createIncome should create transaction and audit log', () => {});
  test('getIncomeList should return paginated results', () => {});
  test('updateIncome should update transaction', () => {});
  test('deleteIncome should soft delete or mark as deleted', () => {});
  test('searchIncome should filter by category, date, amount', () => {});
  test('getMonthlyIncome should calculate monthly totals', () => {});
});
```

#### Expense Service Tests
```typescript
describe('ExpenseService', () => {
  test('createExpense should create transaction and audit log', () => {});
  test('getExpenseList should return paginated results', () => {});
  test('updateExpense should update transaction', () => {});
  test('deleteExpense should soft delete or mark as deleted', () => {});
  test('getMonthlyExpense should calculate monthly totals', () => {});
});
```

#### Dashboard Service Tests
```typescript
describe('DashboardService', () => {
  test('getSummary should calculate income, expense, balance', () => {});
  test('getTodayIncome should only include today transactions', () => {});
  test('getMonthlyTrend should calculate monthly progression', () => {});
  test('getCategoryBreakdown should aggregate by category', () => {});
});
```

#### Report Service Tests
```typescript
describe('ReportService', () => {
  test('getMonthlyReport should calculate monthly totals', () => {});
  test('getYearlyReport should calculate yearly summary', () => {});
  test('getBalanceSheet should show assets and liabilities', () => {});
  test('verifyReportTotals should match database', () => {});
});
```

#### Audit Service Tests
```typescript
describe('AuditService', () => {
  test('logAction should create audit log entry', () => {});
  test('getAuditLogs should return paginated results', () => {});
  test('filterByAction should filter by action type', () => {});
  test('auditLogsAreImmutable should prevent deletion', () => {});
});
```

---

## Integration Tests to Implement

### Authentication Flow Integration
```typescript
describe('Authentication Flow Integration', () => {
  test('Login → Token Generation → Access Protected Endpoint → Logout', () => {
    // 1. POST /auth/login with credentials
    // 2. Verify JWT token returned
    // 3. GET /api/income with token
    // 4. Verify endpoint returns data
    // 5. POST /auth/logout
    // 6. Verify token invalidated
  });

  test('Expired Token → 401 Response', () => {
    // 1. Generate token
    // 2. Wait for expiration (or mock time)
    // 3. Use expired token
    // 4. Verify 401 Unauthorized response
  });

  test('Invalid Token → 401 Response', () => {
    // 1. Use tampered/invalid token
    // 2. Verify 401 Unauthorized response
  });
});
```

### Income CRUD Integration
```typescript
describe('Income CRUD Integration', () => {
  test('POST /api/income → Income created with audit log', () => {});
  test('GET /api/income → Returns paginated list', () => {});
  test('PUT /api/income/:id → Updates income', () => {});
  test('DELETE /api/income/:id → Deletes income', () => {});
});
```

### Financial Accuracy Tests
```typescript
describe('Financial Calculations Integration', () => {
  test('Income + Expense = Balance', () => {
    // Create income: 1000
    // Create expense: 300
    // Verify balance = 700
  });

  test('Day Book running balance is correct', () => {
    // Create multiple transactions
    // Verify running balance increases/decreases correctly
  });

  test('Ledger debit/credit matches transactions', () => {
    // Create income (credit)
    // Create expense (debit)
    // Verify ledger shows correct debit/credit amounts
  });

  test('Monthly report totals match database', () => {
    // Create transactions for March
    // Generate March report
    // Verify totals match actual transactions
  });
});
```

---

## Database Transaction Tests

### Test Scenarios

```typescript
describe('Database Transactions', () => {
  test('Rollback on validation error', async () => {
    // Attempt to create invalid transaction
    // Verify no partial record created
    // Verify audit log not created
  });

  test('Atomicity: All or Nothing', async () => {
    // Create transaction that involves multiple operations:
    // 1. Create Transaction record
    // 2. Create TransactionEntry record
    // 3. Create AuditLog entry
    // If any fails, all rollback
  });

  test('Concurrent transactions isolation', async () => {
    // Create two transactions simultaneously
    // Verify both succeed
    // Verify no data corruption
  });

  test('Cascade delete on category removal', async () => {
    // Create income with category
    // Delete category
    // Verify transaction marked as orphaned (or handled appropriately)
  });
});
```

---

## End-to-End Test Scenarios

### Scenario 1: Complete Day
```
1. Login as admin
2. Add income (Student Fees: 5000)
3. Add expense (Electricity: 500)
4. View Dashboard (verify totals updated)
5. View Day Book (verify transactions appear)
6. Generate Monthly Report
7. View Audit Log
8. Logout
```

### Scenario 2: Income Management
```
1. Login
2. Add income (Donation: 2000)
3. View income in list
4. Edit income (amount: 2500)
5. Verify updated in list
6. Delete income
7. Verify removed from list
8. Verify audit log shows all actions
```

### Scenario 3: Search & Filter
```
1. Login
2. Add 10 income transactions
3. Search by category
4. Filter by date range
5. Verify results
6. Sort by amount
7. Paginate through results
```

### Scenario 4: Error Handling
```
1. Try to login with wrong password (should fail)
2. Try to create income with invalid amount (should fail)
3. Try to create income with future date (should fail)
4. Verify error messages are user-friendly
5. Verify no stack traces in errors
```

---

## Test Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test validation.test.ts
npm test auth.test.ts
npm test incomeService.test.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage Report
```bash
npm test -- --coverage
```

### Run Only Tests Matching Pattern
```bash
npm test -- --testNamePattern="validation"
npm test -- --testNamePattern="auth"
```

### Generate Coverage Report HTML
```bash
npm test -- --coverage --coverageReporters=html
# Open coverage/index.html in browser
```

---

## Coverage Targets

### Current Status
```
Statements:  TBD
Branches:    TBD
Functions:   TBD
Lines:       TBD
```

### Phase 14 Target
```
Statements:  70% minimum
Branches:    60% minimum
Functions:   70% minimum
Lines:       70% minimum
```

### Ideal (Phase 14 Goal)
```
Statements:  80%+
Branches:    75%+
Functions:   85%+
Lines:       80%+
```

---

## Critical Paths to Test

### Authentication (100% coverage required)
- ✅ Valid login
- ✅ Invalid password
- ✅ Invalid email
- ✅ Token verification
- ✅ Token expiration
- ✅ Logout
- ✅ Protected endpoint access

### Financial Calculations (100% coverage required)
- ✅ Income creation and calculation
- ✅ Expense creation and calculation
- ✅ Running balance accuracy
- ✅ Monthly totals
- ✅ Yearly totals
- ✅ Balance sheet calculation

### Input Validation (100% coverage required)
- ✅ Email validation
- ✅ Password strength
- ✅ Amount validation (no negatives, decimals only)
- ✅ Date format validation
- ✅ Phone validation

### Error Handling (90%+ coverage required)
- ✅ Invalid input rejection
- ✅ Unauthorized access prevention
- ✅ Safe error messages
- ✅ No stack trace exposure
- ✅ Rate limiting enforcement

### Audit Logging (90%+ coverage required)
- ✅ Login logged
- ✅ Logout logged
- ✅ Income created logged
- ✅ Income updated logged
- ✅ Income deleted logged
- ✅ Expense operations logged
- ✅ Settings changes logged

---

## Continuous Integration Testing

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: madrasa_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install
      - run: npm run build
      - run: npm test -- --coverage
      - run: npm run test:performance
```

---

## Test Maintenance

### Regular Tasks

**After Each Commit:**
- Run full test suite
- Verify coverage doesn't decrease
- Fix failing tests immediately

**Weekly:**
- Review test coverage reports
- Update tests for new features
- Remove obsolete tests

**Monthly:**
- Audit test quality
- Refactor slow tests
- Add missing test cases

---

## Best Practices

### 1. Test Names Should Be Descriptive
```typescript
// ❌ Bad
test('works', () => {});
test('test1', () => {});

// ✅ Good
test('should validate email format correctly', () => {});
test('should reject password without special character', () => {});
```

### 2. One Assertion Per Test (Ideally)
```typescript
// ❌ Bad
test('authentication', () => {
  const token = generateToken(...);
  expect(token).toBeDefined();
  const decoded = verifyToken(token);
  expect(decoded.userId).toBe(...);
  expect(decoded.exp).toBeDefined();
});

// ✅ Good
test('should generate valid JWT token', () => {
  const token = generateToken(...);
  expect(token).toBeDefined();
});

test('should include userId in token payload', () => {
  const decoded = verifyToken(token);
  expect(decoded.userId).toBe(...);
});
```

### 3. Use Meaningful Test Data
```typescript
// ❌ Bad
test('creates transaction', () => {
  const result = createTransaction({ amount: 123 });
});

// ✅ Good
test('creates income transaction with student fees', () => {
  const result = createTransaction({
    type: 'INCOME',
    category: 'Student Fees',
    amount: 5000,
    date: '2026-08-22',
  });
  expect(result.type).toBe('INCOME');
});
```

### 4. Clean Up After Tests
```typescript
afterEach(async () => {
  // Clear test data
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});
```

---

## Troubleshooting

### Tests Fail with Database Error
```
Ensure DATABASE_URL is set to test database:
export DATABASE_URL="postgresql://test:test@localhost:5432/madrasa_test"
```

### Tests Timeout
```
Increase Jest timeout:
test('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Coverage Not Generated
```bash
npm test -- --coverage --collectCoverageFrom="src/**/*.ts"
```

---

## Next Steps

### Phase 14 Tasks
1. Implement service layer tests (incomeService, expenseService, etc.)
2. Implement API integration tests
3. Implement database transaction tests
4. Achieve 70%+ coverage
5. Document all test scenarios

### Phase 15 Tasks
1. Add frontend component tests
2. Add E2E tests (Playwright or Cypress)
3. Add performance regression tests
4. Improve coverage to 80%+

### Phase 16 Tasks
1. CI/CD integration (GitHub Actions)
2. Automated test reporting
3. Coverage tracking
4. Performance benchmarking

---

## References

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing/testing)

---

**Status:** Phase 14 in progress
**Last Updated:** 2026-08-22
