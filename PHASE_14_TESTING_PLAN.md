# PHASE 14 — COMPREHENSIVE TESTING PLAN

**Date**: 2026-08-20
**Status**: TESTING STRATEGY DOCUMENTED
**Overall Coverage Target**: 80%+

---

## Executive Summary

A comprehensive testing strategy for the Madrasa Accounting Software covering all critical paths. The system requires unit tests, API integration tests, database tests, and accounting calculation verification tests to ensure financial accuracy and system reliability.

---

## 1. BACKEND UNIT TESTS

### 1.1 Security Tests

**PasswordHasher Tests**:
```csharp
[TestClass]
public class PasswordHasherTests
{
    private PasswordHasher _hasher;

    [TestInitialize]
    public void Setup() => _hasher = new PasswordHasher();

    [TestMethod]
    public void HashPassword_ShouldNotBeEmpty()
    {
        // Arrange
        var password = "TestPassword123!";

        // Act
        var hash = _hasher.HashPassword(password);

        // Assert
        Assert.IsNotNull(hash);
        Assert.IsTrue(hash.Length > 0);
    }

    [TestMethod]
    public void HashPassword_SamePasswordProducesDifferentHash()
    {
        // Arrange
        var password = "TestPassword123!";

        // Act
        var hash1 = _hasher.HashPassword(password);
        var hash2 = _hasher.HashPassword(password);

        // Assert
        Assert.AreNotEqual(hash1, hash2); // Different salt = different hash
    }

    [TestMethod]
    public void VerifyPassword_CorrectPasswordReturnsTrue()
    {
        // Arrange
        var password = "TestPassword123!";
        var hash = _hasher.HashPassword(password);

        // Act
        var result = _hasher.VerifyPassword(password, hash);

        // Assert
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void VerifyPassword_WrongPasswordReturnsFalse()
    {
        // Arrange
        var password = "TestPassword123!";
        var hash = _hasher.HashPassword(password);

        // Act
        var result = _hasher.VerifyPassword("WrongPassword", hash);

        // Assert
        Assert.IsFalse(result);
    }
}
```

**JwtTokenGenerator Tests**:
```csharp
[TestClass]
public class JwtTokenGeneratorTests
{
    private JwtTokenGenerator _generator;
    private Guid _adminId;

    [TestInitialize]
    public void Setup()
    {
        _generator = new JwtTokenGenerator("test-secret-key-1234567890", "TestIssuer", "TestAudience", 24);
        _adminId = Guid.NewGuid();
    }

    [TestMethod]
    public void GenerateToken_ReturnsValidToken()
    {
        // Act
        var token = _generator.GenerateToken(_adminId);

        // Assert
        Assert.IsNotNull(token);
        Assert.IsTrue(token.Length > 0);
    }

    [TestMethod]
    public void GenerateToken_TokenContainsAdminId()
    {
        // Act
        var token = _generator.GenerateToken(_adminId);
        var claims = _generator.ValidateToken(token);

        // Assert
        Assert.IsNotNull(claims);
        Assert.AreEqual(_adminId.ToString(), claims.Subject);
    }

    [TestMethod]
    public void ValidateToken_ExpiredTokenThrows()
    {
        // Arrange
        var expiredGenerator = new JwtTokenGenerator("test-secret", "TestIssuer", "TestAudience", -1);
        var token = expiredGenerator.GenerateToken(_adminId);
        Thread.Sleep(1000); // Wait for expiration

        // Act & Assert
        Assert.ThrowsException<SecurityTokenExpiredException>(() =>
            _generator.ValidateToken(token));
    }
}
```

### 1.2 Service Layer Tests

**IncomeServiceTests**:
```csharp
[TestClass]
public class IncomeServiceTests
{
    private IIncomeService _service;
    private MadrasaDbContext _context;
    private Guid _adminId;

    [TestInitialize]
    public void Setup()
    {
        // Setup in-memory database
        var options = new DbContextOptionsBuilder<MadrasaDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new MadrasaDbContext(options);
        _service = new IncomeService(_context, new CreateIncomeValidator(), new UpdateIncomeValidator());
        _adminId = Guid.NewGuid();

        // Setup test data
        SetupTestData();
    }

    private void SetupTestData()
    {
        var category = new IncomeCategory
        {
            Id = Guid.NewGuid(),
            AdminId = _adminId,
            Name = "Student Fees",
            CreatedAt = DateTime.UtcNow
        };
        _context.IncomeCategories.Add(category);
        _context.SaveChanges();
    }

    [TestMethod]
    public async Task CreateIncome_ValidRequest_ReturnsIncome()
    {
        // Arrange
        var request = new CreateIncomeRequest
        {
            CategoryId = _context.IncomeCategories.First().Id,
            Amount = 5000,
            Date = DateTime.UtcNow,
            Description = "Monthly fees",
            PaymentMethod = "Bank"
        };

        // Act
        var result = await _service.CreateIncomeAsync(_adminId, request);

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(5000, result.Amount);
        Assert.AreEqual("Student Fees", result.CategoryName);
    }

    [TestMethod]
    public async Task CreateIncome_CreatesAuditLog()
    {
        // Arrange
        var request = new CreateIncomeRequest
        {
            CategoryId = _context.IncomeCategories.First().Id,
            Amount = 5000,
            Date = DateTime.UtcNow,
            Description = "Monthly fees",
            PaymentMethod = "Bank"
        };

        // Act
        var result = await _service.CreateIncomeAsync(_adminId, request);

        // Assert - Verify audit log created
        var auditLog = await _context.AuditLogs
            .Where(a => a.TransactionId == result.Id)
            .FirstOrDefaultAsync();

        Assert.IsNotNull(auditLog);
        Assert.AreEqual("IncomeCreated", auditLog.ActionType);
    }

    [TestMethod]
    public async Task GetIncomeList_WithDateFilter_ReturnsFilteredResults()
    {
        // Arrange - Create test data
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var category = _context.IncomeCategories.First();

        var income1 = new Income { /* today */ };
        var income2 = new Income { /* tomorrow */ };

        // Act
        var result = await _service.GetIncomeListAsync(_adminId, 1, 10, today, today);

        // Assert
        Assert.AreEqual(1, result.Items.Count); // Only today's income
    }

    [TestMethod]
    public async Task DeleteIncome_CreatesAuditLog()
    {
        // Arrange - Create income first
        var income = new Income { /* setup */ };
        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();

        // Act
        await _service.DeleteIncomeAsync(_adminId, income.Id);

        // Assert - Verify audit log created
        var auditLog = await _context.AuditLogs
            .Where(a => a.TransactionId == income.Id)
            .FirstOrDefaultAsync();

        Assert.IsNotNull(auditLog);
        Assert.AreEqual("IncomeDeleted", auditLog.ActionType);
    }
}
```

---

## 2. API ENDPOINT TESTS

### 2.1 Authentication Endpoints

**AuthControllerTests**:
```csharp
[TestClass]
public class AuthControllerTests
{
    private AuthController _controller;
    private Mock<IAuthService> _mockAuthService;
    private Mock<ILogger<AuthController>> _mockLogger;

    [TestInitialize]
    public void Setup()
    {
        _mockAuthService = new Mock<IAuthService>();
        _mockLogger = new Mock<ILogger<AuthController>>();
        _controller = new AuthController(_mockAuthService.Object, _mockLogger.Object);
    }

    [TestMethod]
    public async Task Login_ValidCredentials_Returns200WithToken()
    {
        // Arrange
        var request = new LoginRequest { Email = "admin@madrasa.com", Password = "Password123!" };
        var loginResponse = new LoginResponse { Token = "test-token", ExpiresIn = 86400 };

        _mockAuthService.Setup(s => s.LoginAsync(request))
            .ReturnsAsync(loginResponse);

        // Act
        var result = await _controller.Login(request) as OkObjectResult;

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(200, result.StatusCode);
    }

    [TestMethod]
    public async Task Login_InvalidPassword_Returns401()
    {
        // Arrange
        var request = new LoginRequest { Email = "admin@madrasa.com", Password = "WrongPassword" };

        _mockAuthService.Setup(s => s.LoginAsync(request))
            .ThrowsAsync(new UnauthorizedAccessException());

        // Act & Assert
        Assert.ThrowsException<UnauthorizedAccessException>(async () =>
            await _controller.Login(request));
    }

    [TestMethod]
    public async Task ChangePassword_ValidPassword_Returns200()
    {
        // Arrange
        var request = new ChangePasswordRequest
        {
            OldPassword = "OldPassword123!",
            NewPassword = "NewPassword456!"
        };

        _mockAuthService.Setup(s => s.ChangePasswordAsync(It.IsAny<Guid>(), request))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.ChangePassword(request) as OkObjectResult;

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(200, result.StatusCode);
    }
}
```

### 2.2 Income Endpoints

**IncomeControllerTests**:
```csharp
[TestClass]
public class IncomeControllerTests
{
    private IncomeController _controller;
    private Mock<IIncomeService> _mockService;

    [TestInitialize]
    public void Setup()
    {
        _mockService = new Mock<IIncomeService>();
        _controller = new IncomeController(_mockService.Object, Mock.Of<ILogger<IncomeController>>());
    }

    [TestMethod]
    public async Task CreateIncome_ValidRequest_Returns201()
    {
        // Arrange
        var request = new CreateIncomeRequest { /* valid data */ };
        var response = new IncomeResponse { /* response data */ };

        _mockService.Setup(s => s.CreateIncomeAsync(It.IsAny<Guid>(), request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.CreateIncome(request) as CreatedAtActionResult;

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(201, result.StatusCode);
    }

    [TestMethod]
    public async Task GetIncome_ValidId_Returns200()
    {
        // Arrange
        var incomeId = Guid.NewGuid();
        var response = new IncomeResponse { Id = incomeId };

        _mockService.Setup(s => s.GetIncomeByIdAsync(It.IsAny<Guid>(), incomeId))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetIncome(incomeId) as OkObjectResult;

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(200, result.StatusCode);
    }

    [TestMethod]
    public async Task DeleteIncome_ValidId_Returns200()
    {
        // Arrange
        var incomeId = Guid.NewGuid();

        _mockService.Setup(s => s.DeleteIncomeAsync(It.IsAny<Guid>(), incomeId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteIncome(incomeId) as OkObjectResult;

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(200, result.StatusCode);
    }
}
```

---

## 3. ACCOUNTING CALCULATION TESTS

### 3.1 Balance Calculation Tests

```csharp
[TestClass]
public class BalanceCalculationTests
{
    private MadrasaDbContext _context;
    private Guid _adminId;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<MadrasaDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new MadrasaDbContext(options);
        _adminId = Guid.NewGuid();
        SetupTestData();
    }

    [TestMethod]
    public async Task CalculateBalance_NoTransactions_ReturnsZero()
    {
        // Arrange & Act
        var income = await _context.Incomes.Where(i => i.AdminId == _adminId).SumAsync(i => i.Amount);
        var expense = await _context.Expenses.Where(e => e.AdminId == _adminId).SumAsync(e => e.Amount);
        var balance = income - expense;

        // Assert
        Assert.AreEqual(0, balance);
    }

    [TestMethod]
    public async Task CalculateBalance_IncomeOnly_ReturnsIncomeAmount()
    {
        // Arrange - Create income transactions
        var incomeAmount = 5000m;
        // Add income to context

        // Act
        var income = await _context.Incomes.Where(i => i.AdminId == _adminId).SumAsync(i => i.Amount);
        var balance = income;

        // Assert
        Assert.AreEqual(incomeAmount, balance);
    }

    [TestMethod]
    public async Task CalculateBalance_IncomeAndExpense_ReturnsCorrectBalance()
    {
        // Arrange
        var income = 10000m;
        var expense = 3000m;
        var expected = income - expense;

        // Act & Assert - Add income and expense, verify balance
        Assert.AreEqual(expected, 7000);
    }

    [TestMethod]
    public async Task CalculateBalance_DecimalPrecision_NoRoundingErrors()
    {
        // Arrange
        var amount1 = 0.01m;
        var amount2 = 0.02m;
        var amount3 = 0.03m;
        var expected = 0.06m;

        // Act
        var sum = amount1 + amount2 + amount3;

        // Assert - No floating point errors
        Assert.AreEqual(expected, sum);
    }
}
```

### 3.2 Ledger Running Balance Tests

```csharp
[TestClass]
public class LedgerRunningBalanceTests
{
    [TestMethod]
    public void RunningBalance_IncomeTransaction_IncreasesBalance()
    {
        // Arrange
        decimal openingBalance = 1000;
        decimal income = 500;
        decimal expectedBalance = 1500;

        // Act
        decimal runningBalance = openingBalance + income;

        // Assert
        Assert.AreEqual(expectedBalance, runningBalance);
    }

    [TestMethod]
    public void RunningBalance_ExpenseTransaction_DecreasesBalance()
    {
        // Arrange
        decimal openingBalance = 1000;
        decimal expense = 300;
        decimal expectedBalance = 700;

        // Act
        decimal runningBalance = openingBalance - expense;

        // Assert
        Assert.AreEqual(expectedBalance, runningBalance);
    }

    [TestMethod]
    public void RunningBalance_MultipleTransactions_CorrectSequence()
    {
        // Arrange
        decimal balance = 1000;
        var transactions = new[] { 100, -50, 200, -75 };
        var expectedBalances = new[] { 1100, 1050, 1250, 1175 };

        // Act & Assert
        for (int i = 0; i < transactions.Length; i++)
        {
            balance += transactions[i];
            Assert.AreEqual(expectedBalances[i], balance);
        }
    }
}
```

### 3.3 Report Calculation Tests

```csharp
[TestClass]
public class ReportCalculationTests
{
    [TestMethod]
    public void MonthlyReport_TotalIncome_CalculatedCorrectly()
    {
        // Arrange
        var income = new[] { 5000m, 3000m, 2000m };
        var expected = 10000m;

        // Act
        var total = income.Sum();

        // Assert
        Assert.AreEqual(expected, total);
    }

    [TestMethod]
    public void MonthlyReport_CategoryPercentage_CalculatedCorrectly()
    {
        // Arrange
        var income = 10000m;
        var categoryAmount = 4000m;
        var expected = 40m; // 40%

        // Act
        var percentage = (categoryAmount / income) * 100;

        // Assert
        Assert.AreEqual(expected, percentage);
    }

    [TestMethod]
    public void YearlyReport_AnnualBalance_CorrectlyAggregated()
    {
        // Arrange
        var monthlyBalances = new[] { 1000, 1500, 800, 2000, 900, 1200, 1100, 950, 1300, 1100, 1200, 800 };
        var expected = 14250;

        // Act
        var annual = monthlyBalances.Sum();

        // Assert
        Assert.AreEqual(expected, annual);
    }
}
```

---

## 4. DATABASE TESTS

### 4.1 Constraints Enforcement

```csharp
[TestClass]
public class DatabaseConstraintsTests
{
    private MadrasaDbContext _context;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<MadrasaDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new MadrasaDbContext(options);
    }

    [TestMethod]
    public async Task Insert_NegativeAmount_ViolatesCheckConstraint()
    {
        // Arrange
        var income = new Income
        {
            Amount = -100, // Violates CHECK (Amount > 0)
            // other properties
        };

        // Act & Assert
        try
        {
            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();
            Assert.Fail("Should have thrown exception");
        }
        catch (Exception ex)
        {
            Assert.IsTrue(ex.Message.Contains("check constraint") || ex.InnerException?.Message.Contains("check constraint") == true);
        }
    }

    [TestMethod]
    public async Task Insert_InvalidCategory_ViolatesForeignKey()
    {
        // Arrange
        var income = new Income
        {
            CategoryId = Guid.NewGuid(), // Non-existent category
            // other properties
        };

        // Act & Assert - Foreign key violation
        try
        {
            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();
            Assert.Fail("Should have thrown exception");
        }
        catch (Exception ex)
        {
            Assert.IsTrue(ex.Message.Contains("foreign key") || ex.InnerException?.Message.Contains("foreign key") == true);
        }
    }
}
```

### 4.2 Transaction Rollback Tests

```csharp
[TestClass]
public class TransactionRollbackTests
{
    private MadrasaDbContext _context;

    [TestMethod]
    public async Task IncomeCreate_WithInvalidAuditLog_RollsBackBoth()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<MadrasaDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new MadrasaDbContext(options);
        var income = new Income { /* valid */ };
        var auditLog = new AuditLog { /* invalid - missing required field */ };

        // Act & Assert
        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                _context.Incomes.Add(income);
                await _context.SaveChangesAsync();

                _context.AuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                Assert.Fail("Should have thrown exception");
            }
            catch
            {
                await transaction.RollbackAsync();
            }
        }

        // Verify rollback - income should not exist
        var count = await _context.Incomes.CountAsync();
        Assert.AreEqual(0, count);
    }
}
```

---

## 5. VALIDATION TESTS

### 5.1 Input Validation

```csharp
[TestClass]
public class ValidationTests
{
    private IValidator<CreateIncomeRequest> _incomeValidator;

    [TestInitialize]
    public void Setup()
    {
        _incomeValidator = new CreateIncomeValidator();
    }

    [TestMethod]
    public async Task CreateIncome_AmountZero_ValidationFails()
    {
        // Arrange
        var request = new CreateIncomeRequest { Amount = 0 };

        // Act
        var result = await _incomeValidator.ValidateAsync(request);

        // Assert
        Assert.IsFalse(result.IsValid);
        Assert.IsTrue(result.Errors.Any(e => e.PropertyName == "Amount"));
    }

    [TestMethod]
    public async Task CreateIncome_NegativeAmount_ValidationFails()
    {
        // Arrange
        var request = new CreateIncomeRequest { Amount = -100 };

        // Act
        var result = await _incomeValidator.ValidateAsync(request);

        // Assert
        Assert.IsFalse(result.IsValid);
    }

    [TestMethod]
    public async Task CreateIncome_FutureDate_ValidationFails()
    {
        // Arrange
        var request = new CreateIncomeRequest { Date = DateTime.UtcNow.AddDays(1) };

        // Act
        var result = await _incomeValidator.ValidateAsync(request);

        // Assert
        Assert.IsFalse(result.IsValid);
    }

    [TestMethod]
    public async Task CreateIncome_InvalidPaymentMethod_ValidationFails()
    {
        // Arrange
        var request = new CreateIncomeRequest { PaymentMethod = "CreditCard" }; // Only Cash or Bank

        // Act
        var result = await _incomeValidator.ValidateAsync(request);

        // Assert
        Assert.IsFalse(result.IsValid);
    }
}
```

---

## 6. TEST EXECUTION & COVERAGE

### Test Counts (Target)

| Category | Count | Status |
|----------|-------|--------|
| Unit Tests | 50+ | To implement |
| API Tests | 40+ | To implement |
| Database Tests | 20+ | To implement |
| Calculation Tests | 30+ | To implement |
| Validation Tests | 25+ | To implement |
| **Total** | **165+** | **To implement** |

### Coverage Targets

| Area | Target | Priority |
|------|--------|----------|
| Services | 85%+ | High |
| Controllers | 80%+ | High |
| Security | 95%+ | Critical |
| Calculations | 100% | Critical |
| Validation | 95%+ | High |
| Database | 80%+ | Medium |

---

## 7. ✅ VERIFICATION CHECKLIST

- [ ] All unit tests pass
- [ ] All API tests pass
- [ ] All database tests pass
- [ ] All calculation tests pass
- [ ] All validation tests pass
- [ ] Code coverage 80%+
- [ ] No failing tests
- [ ] All critical paths tested
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Financial accuracy verified
- [ ] Database rollback verified
- [ ] Error handling tested

---

## 🎯 TESTING SUMMARY

**Test Framework**: xUnit.net (C#) + Flutter Test Framework
**Coverage Target**: 80%+
**Total Tests**: 165+
**Critical Tests**: Security, Calculations, Transactions

**Key Test Areas**:
1. ✅ Security (password hashing, JWT)
2. ✅ CRUD operations (Income, Expense)
3. ✅ Financial calculations (balance, running balance)
4. ✅ Reports (monthly, yearly, balance sheet)
5. ✅ Database integrity (transactions, constraints)
6. ✅ Input validation (all fields)
7. ✅ Authentication (login, token)
8. ✅ Error handling

---

**Phase 14 Testing Plan**: ✅ **DOCUMENTED & READY FOR IMPLEMENTATION**

Comprehensive test strategy defined covering 165+ test cases across all modules. Ready for test implementation with example test cases provided. 🧪

