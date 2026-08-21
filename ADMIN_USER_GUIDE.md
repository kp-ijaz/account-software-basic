# ADMINISTRATOR USER GUIDE

Quick-start guide for using Madrasa Accounting Software.

**Version**: 1.0.0  
**Audience**: Madrasa Administrator  
**Date**: 2026-08-20

---

## Getting Started

### First Login

1. **Open Application**
   - Desktop: Run the application
   - Web: Go to https://yourdomain.com
   - Mobile: Open app

2. **Enter Credentials**
   - Email: `admin@madrasa.local`
   - Password: [Initial password provided]

3. **Important**: Change Password Immediately
   - Click Profile (top right)
   - Select "Change Password"
   - Enter current password
   - Enter new strong password
   - Confirm new password
   - Save

### Dashboard Overview

Your Dashboard shows:

- **Today's Income**: Income recorded today
- **Today's Expenses**: Expenses recorded today
- **Current Cash Balance**: Total cash on hand
- **Current Bank Balance**: Total in bank
- **This Month's Income**: Total income for current month
- **This Month's Expenses**: Total expenses for current month
- **Recent Transactions**: Last 10 transactions
- **Chart**: Income vs Expense for 12 months

**Check Dashboard daily** to stay updated on finances.

---

## Recording Income

### Adding Income

1. Click **"Income"** in sidebar
2. Click **"+ Add Income"** button
3. Fill in the form:

   **Date**: When income was received
   - Click calendar
   - Select date
   - Cannot be future date

   **Category**: Type of income
   - Student Fees
   - Donations
   - Zakat
   - Sadaqah
   - Sponsorship
   - Building Fund
   - Other Income

   **Description**: Details (optional but recommended)
   - Example: "August fees for 50 students"
   - Max 500 characters

   **Amount**: How much was received
   - Numbers only
   - Use decimal for coins (e.g., 1500.50)
   - Must be positive
   - Check twice before saving

   **Payment Method**: How was it received?
   - **Cash**: Received physical money
   - **Bank**: Transferred to bank account

4. Click **"Save"** button
5. Confirmation: "Income added successfully"

### Example: Recording Student Fees

```
Date:            2026-08-20
Category:        Student Fees
Description:     August fees for 50 students
Amount:          50000.00
Payment Method:  Bank
```

### Viewing Income

1. Click **"Income"** in sidebar
2. See list of all income
3. Search by description:
   - Type in search box
   - Results update automatically
4. Filter by date:
   - Select start date
   - Select end date
   - Click "Apply"
5. View details:
   - Click on any transaction
   - See full details
   - Edit or delete option

### Editing Income

1. Click **"Income"** in sidebar
2. Find the transaction
3. Click **"Edit"** button
4. Modify fields as needed
5. Click **"Save"**
6. Confirmation: "Income updated successfully"

### Deleting Income

1. Click **"Income"** in sidebar
2. Find the transaction
3. Click **"Delete"** button
4. Confirm: "Are you sure?"
5. Click **"Yes, Delete"**
6. Transaction removed

**Note**: Deletion is recorded in Audit Log

---

## Recording Expenses

### Adding Expense

Same process as income, but:

1. Click **"Expenses"** in sidebar
2. Click **"+ Add Expense"** button
3. Fill in form:

   **Date**: When expense occurred
   **Category**: Type of expense
   - Teacher Salary
   - Electricity
   - Water
   - Food
   - Maintenance
   - Stationery
   - Events
   - Building Maintenance
   - Miscellaneous

   **Description**: Details
   **Amount**: Expense amount
   **Payment Method**: Cash or Bank

4. Click **"Save"**

### Example: Recording Electricity Bill

```
Date:            2026-08-20
Category:        Electricity
Description:     Electricity bill for August
Amount:          2500.00
Payment Method:  Bank
```

---

## Viewing Financial Records

### Day Book (Chronological View)

1. Click **"Day Book"** in sidebar
2. See all transactions in order by date
3. Shows running balance (changes as you go down)
4. Format:
   ```
   Date | Description | Category | Income | Expense | Balance
   ```

5. Filter options:
   - **Today**: Just today's transactions
   - **This Week**: This week's transactions
   - **This Month**: This month's transactions
   - **Custom**: Select date range

6. Export to PDF:
   - Click "Export PDF"
   - File downloads
   - Print or save

### Ledger (Accounting View)

1. Click **"Ledger"** in sidebar
2. Similar to Day Book
3. Format:
   ```
   Date | Description | Debit | Credit | Balance
   ```

4. Filter by category (optional)
5. Running balance shows after each entry
6. Export to PDF available

**Note**: Ledger shows same data as Day Book, just different format

---

## Reports

### Monthly Report

1. Click **"Reports"** in sidebar
2. Click **"Monthly Report"**
3. Select month and year:
   - Choose from dropdowns
   - Click "Generate"
4. View report showing:
   - Total income
   - Total expenses
   - Net balance
   - Income by category with percentages
   - Expense by category with percentages
   - Day book for that month
   - Ledger for that month

5. Export options:
   - **PDF**: Download PDF file
   - **Print**: Print directly

### Example: August 2026 Report

```
Month:               August 2026
Total Income:        150,000 AED
Total Expenses:      50,000 AED
Net Balance:         100,000 AED
Opening Balance:     100,000 AED
Closing Balance:     200,000 AED

Income Breakdown:
- Student Fees:      120,000 (80%)
- Donations:         20,000 (13%)
- Other:             10,000 (7%)

Expense Breakdown:
- Teacher Salary:    30,000 (60%)
- Electricity:       10,000 (20%)
- Other:             10,000 (20%)
```

### Yearly Report

1. Click **"Reports"** in sidebar
2. Click **"Yearly Report"**
3. Select year:
   - Choose from dropdown
   - Click "Generate"
4. View report showing:
   - All 12 months data
   - Monthly income, expense, balance
   - Annual totals
   - Opening and closing balance

5. Export to PDF or print

### Balance Sheet

1. Click **"Reports"** in sidebar
2. Click **"Balance Sheet"**
3. View:
   - **Assets**:
     - Cash on hand
     - Bank balance
     - Total assets
   - **Liabilities**: Pending payments
   - **Current Balance**: Total available
   - **Balanced**: Yes (assets ≈ balance)

---

## Settings

### Update Madrasa Information

1. Click **"Settings"** in sidebar
2. Modify as needed:

   **Madrasa Name**:
   - Example: "Al-Noor Islamic School"

   **Address**:
   - Full physical address

   **Phone**:
   - Contact number

   **Logo**:
   - Click upload
   - Select image (PNG, JPG, GIF)
   - Max 5MB

   **Currency**:
   - Select currency (AED, USD, etc.)

   **Financial Year**:
   - Select current year

3. Click **"Save"**
4. Confirmation: "Settings updated successfully"

---

## Account Management

### Change Password

1. Click **Profile** (top right)
2. Click **"Change Password"**
3. Enter:
   - Current password
   - New password
   - Confirm new password
4. Click **"Change"**
5. Logout and login with new password

**Tips for Strong Password**:
- Use 12+ characters
- Mix uppercase and lowercase
- Include numbers and symbols
- Don't reuse old passwords
- Don't use birthdates or names

### Logout

1. Click **Profile** (top right)
2. Click **"Logout"**
3. You're logged out
4. Must login again to access

---

## Audit Log

### Viewing Activity History

1. Click **"Audit Log"** in sidebar
2. See all activities in reverse chronological order
3. Shows:
   - When activity happened
   - What action was performed
   - Who did it (admin email)
   - Description of action
   - Old values (if changed)
   - New values (if changed)

4. Activities tracked:
   - Login
   - Logout
   - Password change
   - Income created/edited/deleted
   - Expense created/edited/deleted
   - Settings changed
   - Logo upload

5. Filter options:
   - By date range
   - By action type
   - Search description

**Note**: Audit log cannot be deleted (permanent record)

---

## Frequently Asked Questions

### Q: Can I delete an entry?
**A**: Yes, but it will be recorded in the audit log. The transaction is permanent.

### Q: Can I edit a past entry?
**A**: Yes, any entry can be edited. The change is recorded in the audit log with old and new values.

### Q: What if I made a mistake?
**A**: You can edit or delete the entry. Both actions are tracked in the audit log.

### Q: How often is my data backed up?
**A**: Daily automatic backups. You can restore from any backup within 30 days.

### Q: Is my password secure?
**A**: Yes, passwords are hashed with PBKDF2-SHA256. Never stored in plain text.

### Q: Can I access from multiple devices?
**A**: Only one admin account. Login from any device. You'll be logged out of other devices.

### Q: What if I forget my password?
**A**: Contact your system administrator. Password reset requires admin access.

### Q: Can I export data?
**A**: Yes, all reports can be exported to PDF. Data is kept for 30+ days in backups.

### Q: Is the application secure?
**A**: Yes, HTTPS encryption, JWT tokens, rate limiting, and complete audit logging.

### Q: Can I add more users?
**A**: No, this is a single-admin application. Only one person can access.

### Q: How do I generate reports?
**A**: Click "Reports" in sidebar, select month/year, click "Generate", then "Export PDF".

### Q: What happens if I close the browser?
**A**: Your token expires after 24 hours. You'll need to login again.

---

## Daily Checklist

**Every Morning**:
- [ ] Login to application
- [ ] Check Dashboard
- [ ] Review today's income/expenses
- [ ] Check month's running total

**When Recording Income**:
- [ ] Enter all income transactions
- [ ] Verify amounts are correct
- [ ] Select correct category
- [ ] Confirm payment method

**When Recording Expenses**:
- [ ] Enter all expense transactions
- [ ] Verify amounts are correct
- [ ] Select correct category
- [ ] Confirm payment method

**End of Day**:
- [ ] Verify all transactions entered
- [ ] Check Day Book for accuracy
- [ ] Reconcile with physical records
- [ ] Logout

**End of Month**:
- [ ] Generate Monthly Report
- [ ] Verify totals are correct
- [ ] Export and archive PDF
- [ ] Compare with bank statement
- [ ] Review audit log

**End of Year**:
- [ ] Generate Yearly Report
- [ ] Verify annual totals
- [ ] Export and archive reports
- [ ] Prepare for new financial year
- [ ] Test backup restoration

---

## Tips & Best Practices

### Accuracy Tips
- Always double-check amounts before saving
- Use consistent descriptions
- Record transactions same day
- Don't leave entries blank
- Verify math monthly

### Organization Tips
- Use clear descriptions
- Keep consistent category usage
- Update settings with logo
- Review audit log weekly
- Archive monthly reports

### Security Tips
- Use strong password (12+ chars)
- Change password quarterly
- Never share credentials
- Logout when leaving computer
- Report suspicious activity

### Backup Tips
- Backup restored monthly (test)
- Keep multiple backup copies
- Store backups securely
- Document recovery process

---

## Support

### For Technical Issues

1. Check Troubleshooting section in README
2. Review this guide
3. Contact system administrator

### Documentation References

- **README.md** - Full technical documentation
- **API_DOCUMENTATION.md** - API reference
- **DATABASE_DOCUMENTATION.md** - Database details
- **SECURITY_DOCUMENTATION.md** - Security information
- **DEPLOYMENT_DOCUMENTATION.md** - Setup procedures

---

**User Guide Version**: 1.0.0  
**Last Updated**: 2026-08-20  
**Status**: Ready for Use

Happy accounting! 📊
