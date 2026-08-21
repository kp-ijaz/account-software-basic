import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../widgets/common/modern_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class ReportsPageV2 extends StatefulWidget {
  const ReportsPageV2({super.key});

  @override
  State<ReportsPageV2> createState() => _ReportsPageV2State();
}

class _ReportsPageV2State extends State<ReportsPageV2> {
  String _selectedReportType = 'monthly';
  int _selectedYear = DateTime.now().year;
  int _selectedMonth = DateTime.now().month;
  DateTime? _customStartDate;
  DateTime? _customEndDate;

  final List<String> _months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  @override
  Widget build(BuildContext context) {
    return ModernLayoutPro(
      title: 'Reports',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Financial Reports', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),

            // Report Type Selection
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 3,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(3),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Select Report Type', style: TextStyle(fontSize: 6, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 2),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _buildReportTypeButton('monthly', 'Monthly Report', Icons.calendar_month),
                        _buildReportTypeButton('yearly', 'Yearly Report', Icons.date_range),
                        _buildReportTypeButton('custom', 'Custom Range', Icons.event_note),
                        _buildReportTypeButton('balance_sheet', 'Balance Sheet', Icons.assessment),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Filters based on selected report
            if (_selectedReportType == 'monthly') _buildMonthlyFilters(context),
            if (_selectedReportType == 'yearly') _buildYearlyFilters(context),
            if (_selectedReportType == 'custom') _buildCustomDateFilters(context),
            if (_selectedReportType == 'balance_sheet') _buildBalanceSheetFilters(context),

            const SizedBox(height: 12),

            // Report Content
            _buildReportContent(context),
          ],
        ),
      ),
    );
  }

  Widget _buildReportTypeButton(String type, String label, IconData icon) {
    final isSelected = _selectedReportType == type;
    return FilterChip(
      selected: isSelected,
      onSelected: (selected) {
        setState(() => _selectedReportType = type);
      },
      avatar: Icon(icon, size: 18),
      label: Text(label),
      backgroundColor: Colors.grey.shade200,
      selectedColor: Colors.blue.shade400,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black87,
        fontWeight: FontWeight.w500,
      ),
    );
  }

  Widget _buildMonthlyFilters(BuildContext context) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Monthly Report Filters', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<int>(
                    initialValue: _selectedMonth,
                    decoration: const InputDecoration(labelText: 'Select Month'),
                    items: List.generate(12, (index) {
                      return DropdownMenuItem(
                        value: index + 1,
                        child: Text(_months[index]),
                      );
                    }),
                    onChanged: (value) {
                      setState(() => _selectedMonth = value ?? _selectedMonth);
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: DropdownButtonFormField<int>(
                    initialValue: _selectedYear,
                    decoration: const InputDecoration(labelText: 'Select Year'),
                    items: List.generate(5, (index) {
                      final year = DateTime.now().year - index;
                      return DropdownMenuItem(
                        value: year,
                        child: Text(year.toString()),
                      );
                    }),
                    onChanged: (value) {
                      setState(() => _selectedYear = value ?? _selectedYear);
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildYearlyFilters(BuildContext context) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Yearly Report Filter', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            DropdownButtonFormField<int>(
              initialValue: _selectedYear,
              decoration: const InputDecoration(labelText: 'Select Year'),
              items: List.generate(5, (index) {
                final year = DateTime.now().year - index;
                return DropdownMenuItem(
                  value: year,
                  child: Text(year.toString()),
                );
              }),
              onChanged: (value) {
                setState(() => _selectedYear = value ?? _selectedYear);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomDateFilters(BuildContext context) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Custom Date Range', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: DatePickerField(
                    label: 'From Date',
                    initialValue: _customStartDate,
                    onDateChanged: (date) => setState(() => _customStartDate = date),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: DatePickerField(
                    label: 'To Date',
                    initialValue: _customEndDate,
                    onDateChanged: (date) => setState(() => _customEndDate = date),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceSheetFilters(BuildContext context) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Balance Sheet', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(
              'As of ${DateFormat('yyyy-MM-dd').format(DateTime.now())}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReportContent(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');

    if (_selectedReportType == 'monthly') {
      return _buildMonthlyReportContent(context, currencyFormat);
    } else if (_selectedReportType == 'yearly') {
      return _buildYearlyReportContent(context, currencyFormat);
    } else if (_selectedReportType == 'custom') {
      return _buildCustomReportContent(context, currencyFormat);
    } else if (_selectedReportType == 'balance_sheet') {
      return _buildBalanceSheetContent(context, currencyFormat);
    }
    return const SizedBox.shrink();
  }

  Widget _buildMonthlyReportContent(BuildContext context, NumberFormat currencyFormat) {
    final monthName = _months[_selectedMonth - 1];
    final income = 7500.00;
    final expense = 3000.00;
    final balance = income - expense;

    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Monthly Report - $monthName $_selectedYear',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const Divider(height: 12),

            // Summary Cards
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Income',
                    amount: income,
                    color: Colors.green,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Expense',
                    amount: expense,
                    color: Colors.red,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Net Balance',
                    amount: balance,
                    color: balance > 0 ? Colors.blue : Colors.orange,
                    currencyFormat: currencyFormat,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Income Summary
            Text('Income Breakdown', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            _buildBreakdownTable(context, [
              {'category': 'Student Fees', 'amount': 5000.00},
              {'category': 'Donations', 'amount': 2000.00},
              {'category': 'Sponsorship', 'amount': 500.00},
            ], currencyFormat),
            const SizedBox(height: 12),

            // Expense Summary
            Text('Expense Breakdown', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            _buildBreakdownTable(context, [
              {'category': 'Teacher Salary', 'amount': 2000.00},
              {'category': 'Electricity', 'amount': 600.00},
              {'category': 'Maintenance', 'amount': 400.00},
            ], currencyFormat),
            const SizedBox(height: 12),

            // Action Buttons
            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('PDF exported successfully!')),
                  ),
                  icon: const Icon(Icons.download),
                  label: const Text('Download PDF'),
                ),
                const SizedBox(width: 8),
                OutlinedButton.icon(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Sent to printer!')),
                  ),
                  icon: const Icon(Icons.print),
                  label: const Text('Print'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildYearlyReportContent(BuildContext context, NumberFormat currencyFormat) {
    final List<Map<String, dynamic>> yearlyData = [
      {'month': 'January', 'income': 6000.00, 'expense': 2500.00},
      {'month': 'February', 'income': 5500.00, 'expense': 2800.00},
      {'month': 'March', 'income': 7000.00, 'expense': 3000.00},
    ];

    double totalIncome = yearlyData.fold(0, (sum, item) => sum + (item['income'] as double));
    double totalExpense = yearlyData.fold(0, (sum, item) => sum + (item['expense'] as double));
    double totalBalance = totalIncome - totalExpense;

    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Yearly Report - $_selectedYear', style: Theme.of(context).textTheme.titleLarge),
            const Divider(height: 12),

            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Annual Income',
                    amount: totalIncome,
                    color: Colors.green,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Annual Expense',
                    amount: totalExpense,
                    color: Colors.red,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Annual Balance',
                    amount: totalBalance,
                    color: Colors.blue,
                    currencyFormat: currencyFormat,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Text('Monthly Summary', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: const [
                  DataColumn(label: Text('Month')),
                  DataColumn(label: Text('Income'), numeric: true),
                  DataColumn(label: Text('Expense'), numeric: true),
                  DataColumn(label: Text('Balance'), numeric: true),
                ],
                rows: yearlyData.map((row) {
                  final balance = (row['income'] as double) - (row['expense'] as double);
                  return DataRow(cells: [
                    DataCell(Text(row['month'])),
                    DataCell(Text('AED ${currencyFormat.format(row['income'])}')),
                    DataCell(Text('AED ${currencyFormat.format(row['expense'])}')),
                    DataCell(
                      Text(
                        'AED ${currencyFormat.format(balance)}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: balance > 0 ? Colors.green : Colors.red,
                        ),
                      ),
                    ),
                  ]);
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomReportContent(BuildContext context, NumberFormat currencyFormat) {
    if (_customStartDate == null || _customEndDate == null) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: Column(
              children: [
                Icon(Icons.date_range, size: 48, color: Colors.grey.shade300),
                const SizedBox(height: 12),
                Text(
                  'Select both date ranges to view report',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Custom Report (${DateFormat('yyyy-MM-dd').format(_customStartDate!)} to ${DateFormat('yyyy-MM-dd').format(_customEndDate!)})',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Income',
                    amount: 12500.00,
                    color: Colors.green,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Expense',
                    amount: 5500.00,
                    color: Colors.red,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Net Balance',
                    amount: 7000.00,
                    color: Colors.blue,
                    currencyFormat: currencyFormat,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceSheetContent(BuildContext context, NumberFormat currencyFormat) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Balance Sheet', style: Theme.of(context).textTheme.titleLarge),
            Text('As of ${DateFormat('yyyy-MM-dd').format(DateTime.now())}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey)),
            const Divider(height: 12),

            Text('ASSETS', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            _buildBalanceSheetRow('Cash', 10000.00, currencyFormat),
            _buildBalanceSheetRow('Bank Balance', 25000.00, currencyFormat),
            const Divider(),
            _buildBalanceSheetRow('Total Assets', 35000.00, currencyFormat, isBold: true),
            const SizedBox(height: 12),

            Text('LIABILITIES', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            _buildBalanceSheetRow('Pending Payments', 5000.00, currencyFormat),
            const Divider(),
            _buildBalanceSheetRow('Total Liabilities', 5000.00, currencyFormat, isBold: true),
            const SizedBox(height: 12),

            Text('BALANCE', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            _buildBalanceSheetRow(
              'Current Balance',
              30000.00,
              currencyFormat,
              isBold: true,
              color: Colors.green,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard({
    required String title,
    required double amount,
    required Color color,
    required NumberFormat currencyFormat,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(title, style: const TextStyle(fontSize: 10, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(
            'AED ${currencyFormat.format(amount)}',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBreakdownTable(
    BuildContext context,
    List<Map<String, dynamic>> data,
    NumberFormat currencyFormat,
  ) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columns: const [
          DataColumn(label: Text('Category')),
          DataColumn(label: Text('Amount'), numeric: true),
        ],
        rows: data
            .map(
              (item) => DataRow(cells: [
                DataCell(Text(item['category'])),
                DataCell(Text('AED ${currencyFormat.format(item['amount'])}')),
              ]),
            )
            .toList(),
      ),
    );
  }

  Widget _buildBalanceSheetRow(
    String label,
    double amount,
    NumberFormat currencyFormat, {
    bool isBold = false,
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              fontSize: isBold ? 14 : 12,
            ),
          ),
          Text(
            'AED ${currencyFormat.format(amount)}',
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              fontSize: isBold ? 14 : 12,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
