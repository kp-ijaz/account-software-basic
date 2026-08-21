# API DOCUMENTATION

Complete REST API reference for Madrasa Accounting Software.

**Base URL**: `https://api.madrasa.local` (Production)  
**Authentication**: JWT Bearer Token (24-hour expiry)

---

## Authentication Endpoints

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "admin@madrasa.local",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400,
  "adminId": "123e4567-e89b-12d3-a456-426614174000"
}
```

Rate Limited: 5 attempts/minute

---

### Logout
**POST** `/api/auth/logout`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Change Password
**POST** `/api/auth/change-password`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

Rate Limited: 3 attempts/minute

---

## Income Endpoints

### Create Income
**POST** `/api/income`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "date": "2026-08-20",
  "categoryId": "123e4567-e89b-12d3-a456-426614174001",
  "description": "Student fees for August",
  "amount": 10000.00,
  "paymentMethod": "Bank"
}
```

Response (201 Created):
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174002",
  "date": "2026-08-20",
  "categoryId": "123e4567-e89b-12d3-a456-426614174001",
  "categoryName": "Student Fees",
  "description": "Student fees for August",
  "amount": 10000.00,
  "paymentMethod": "Bank",
  "createdAt": "2026-08-20T10:30:00Z"
}
```

Validation:
- Amount must be > 0
- Amount must have max 2 decimal places
- Date must not be in future
- Category must exist
- Description required

---

### Get Income List
**GET** `/api/income?page=1&pageSize=50`

Headers: `Authorization: Bearer {token}`

Query Parameters:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 50, max: 100)
- `startDate` - Filter from date (optional)
- `endDate` - Filter to date (optional)
- `categoryId` - Filter by category (optional)
- `searchTerm` - Search description (optional)

Response (200 OK):
```json
{
  "items": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174002",
      "date": "2026-08-20",
      "categoryName": "Student Fees",
      "description": "Student fees for August",
      "amount": 10000.00,
      "paymentMethod": "Bank"
    }
  ],
  "totalCount": 150,
  "pageNumber": 1,
  "pageSize": 50,
  "totalPages": 3
}
```

---

### Get Income by ID
**GET** `/api/income/{id}`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174002",
  "date": "2026-08-20",
  "categoryId": "123e4567-e89b-12d3-a456-426614174001",
  "categoryName": "Student Fees",
  "description": "Student fees for August",
  "amount": 10000.00,
  "paymentMethod": "Bank",
  "createdAt": "2026-08-20T10:30:00Z",
  "updatedAt": "2026-08-20T10:30:00Z"
}
```

---

### Update Income
**PUT** `/api/income/{id}`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "date": "2026-08-20",
  "categoryId": "123e4567-e89b-12d3-a456-426614174001",
  "description": "Student fees updated",
  "amount": 10500.00,
  "paymentMethod": "Bank"
}
```

Response (200 OK):
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174002",
  "date": "2026-08-20",
  "categoryName": "Student Fees",
  "description": "Student fees updated",
  "amount": 10500.00,
  "paymentMethod": "Bank",
  "updatedAt": "2026-08-20T11:00:00Z"
}
```

---

### Delete Income
**DELETE** `/api/income/{id}`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "success": true,
  "message": "Income deleted successfully"
}
```

---

## Expense Endpoints

### Create Expense
**POST** `/api/expense`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "date": "2026-08-20",
  "categoryId": "789e1234-e89b-12d3-a456-426614174003",
  "description": "Electricity bill for August",
  "amount": 5000.00,
  "paymentMethod": "Bank"
}
```

Response (201 Created):
```json
{
  "id": "901f2345-e89b-12d3-a456-426614174004",
  "date": "2026-08-20",
  "categoryId": "789e1234-e89b-12d3-a456-426614174003",
  "categoryName": "Electricity",
  "description": "Electricity bill for August",
  "amount": 5000.00,
  "paymentMethod": "Bank",
  "createdAt": "2026-08-20T10:30:00Z"
}
```

---

### Get Expense List
**GET** `/api/expense?page=1&pageSize=50`

Headers: `Authorization: Bearer {token}`

Query Parameters: Same as Income (page, pageSize, startDate, endDate, categoryId, searchTerm)

---

### Update Expense
**PUT** `/api/expense/{id}`

Headers: `Authorization: Bearer {token}`

Request: Same structure as Create Expense

---

### Delete Expense
**DELETE** `/api/expense/{id}`

Headers: `Authorization: Bearer {token}`

---

## Dashboard Endpoints

### Get Dashboard Summary
**GET** `/api/dashboard/summary`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "todayIncome": 5000.00,
  "todayExpense": 1000.00,
  "currentCashBalance": 50000.00,
  "currentBankBalance": 100000.00,
  "thisMonthIncome": 150000.00,
  "thisMonthExpense": 50000.00,
  "thisMonthBalance": 100000.00,
  "recentTransactions": [
    {
      "id": "123",
      "date": "2026-08-20",
      "type": "Income",
      "description": "Student fees",
      "amount": 5000.00,
      "balance": 155000.00
    }
  ],
  "chartData": {
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "income": [10000, 12000, 11000, 15000, 16000, 14000, 13000, 15000, 0, 0, 0, 0],
    "expenses": [5000, 6000, 5500, 7000, 8000, 7000, 6500, 7000, 0, 0, 0, 0]
  }
}
```

Performance: 350-450ms

---

## Day Book Endpoints

### Get Day Book
**GET** `/api/daybook?page=1&pageSize=50`

Headers: `Authorization: Bearer {token}`

Query Parameters:
- `page` - Page number
- `pageSize` - Items per page
- `filter` - "Today", "Week", "Month", or "Custom"
- `startDate` - For custom filter
- `endDate` - For custom filter
- `searchTerm` - Search description

Response (200 OK):
```json
{
  "items": [
    {
      "date": "2026-08-20",
      "description": "Student fees",
      "category": "Student Fees",
      "income": 5000.00,
      "expense": 0.00,
      "balance": 155000.00
    }
  ],
  "openingBalance": 150000.00,
  "closingBalance": 155000.00,
  "totalIncome": 5000.00,
  "totalExpense": 0.00,
  "totalCount": 150,
  "pageNumber": 1,
  "pageSize": 50
}
```

Performance: 200-350ms

---

## Ledger Endpoints

### Get Ledger
**GET** `/api/ledger?page=1&pageSize=50`

Headers: `Authorization: Bearer {token}`

Query Parameters: Similar to Day Book

Response (200 OK):
```json
{
  "items": [
    {
      "date": "2026-08-20",
      "description": "Student fees",
      "debit": 5000.00,
      "credit": 0.00,
      "balance": 155000.00
    }
  ],
  "openingBalance": 150000.00,
  "closingBalance": 155000.00,
  "totalDebit": 5000.00,
  "totalCredit": 0.00
}
```

Performance: 200-350ms

---

## Reports Endpoints

### Get Monthly Report
**GET** `/api/reports/monthly?month=8&year=2026`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "month": "August",
  "year": 2026,
  "totalIncome": 150000.00,
  "totalExpense": 50000.00,
  "netBalance": 100000.00,
  "openingBalance": 100000.00,
  "closingBalance": 150000.00,
  "incomeByCategory": [
    {
      "category": "Student Fees",
      "amount": 120000.00,
      "percentage": 80.0
    }
  ],
  "expenseByCategory": [
    {
      "category": "Electricity",
      "amount": 20000.00,
      "percentage": 40.0
    }
  ]
}
```

Performance: 400-900ms

---

### Get Yearly Report
**GET** `/api/reports/yearly?year=2026`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "year": 2026,
  "months": [
    {
      "month": "January",
      "income": 100000.00,
      "expense": 40000.00,
      "balance": 60000.00
    }
  ],
  "totalIncome": 1500000.00,
  "totalExpense": 600000.00,
  "yearBalance": 900000.00,
  "openingBalance": 100000.00,
  "closingBalance": 1000000.00
}
```

Performance: 400-900ms

---

### Get Balance Sheet
**GET** `/api/reports/balance-sheet`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "assets": {
    "cash": 50000.00,
    "bankBalance": 900000.00,
    "total": 950000.00
  },
  "liabilities": {
    "pendingPayments": 0.00,
    "total": 0.00
  },
  "currentBalance": 950000.00,
  "isBalanced": true
}
```

---

## Audit Log Endpoints

### Get Audit Log
**GET** `/api/auditlog?page=1&pageSize=50`

Headers: `Authorization: Bearer {token}`

Query Parameters:
- `page` - Page number
- `pageSize` - Items per page
- `actionType` - Filter by action type (optional)
- `startDate` - Filter from date (optional)
- `endDate` - Filter to date (optional)
- `searchTerm` - Search description (optional)

Response (200 OK):
```json
{
  "items": [
    {
      "id": "audit-123",
      "adminId": "admin-456",
      "createdAt": "2026-08-20T10:30:00Z",
      "actionType": "IncomeCreated",
      "description": "Income created",
      "transactionId": "income-789",
      "oldValues": null,
      "newValues": "{\"amount\": 5000.00}"
    }
  ],
  "totalCount": 1000,
  "pageNumber": 1,
  "pageSize": 50
}
```

---

## Settings Endpoints

### Get Settings
**GET** `/api/settings`

Headers: `Authorization: Bearer {token}`

Response (200 OK):
```json
{
  "madrasaName": "Al-Noor Madrasa",
  "address": "123 Main Street",
  "phone": "+971-123-4567",
  "logoUrl": "https://...",
  "currency": "AED",
  "financialYear": "2026",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-08-20T10:30:00Z"
}
```

---

### Update Settings
**PUT** `/api/settings`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "madrasaName": "Al-Noor Madrasa",
  "address": "123 Main Street",
  "phone": "+971-123-4567",
  "currency": "AED",
  "financialYear": "2026"
}
```

Response (200 OK): Same as Get Settings

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred. Please try again later."
}
```

---

## Rate Limiting

Endpoints are rate-limited to prevent abuse:
- **Login**: 5 attempts per minute
- **Password Change**: 3 attempts per minute
- **Other Endpoints**: 100 requests per minute

Response Header: `X-RateLimit-Remaining`

---

## Pagination

All list endpoints support pagination:
- `page` - Page number (1-indexed)
- `pageSize` - Items per page (default: 50, max: 100)

Response includes:
- `totalCount` - Total items available
- `pageNumber` - Current page
- `pageSize` - Items per page
- `totalPages` - Total pages available

---

## Authentication

All endpoints except `/api/auth/login` require JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires after 24 hours. After expiry, user must login again.

---

**API Version**: 1.0.0  
**Last Updated**: 2026-08-20
