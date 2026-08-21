import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../widgets/common/modern_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class DayBookPageV2 extends StatefulWidget {
  const DayBookPageV2({super.key});

  @override
  State<DayBookPageV2> createState() => _DayBookPageV2State();
}

class _DayBookPageV2State extends State<DayBookPageV2> {
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _filterType = 'all';

  final List<Map<String, dynamic>> _transactions = [
    {
      'date': DateTime(2026, 8, 20),
      'description': 'Student fee payment',
      'category': 'Student Fees',
      'income': 5000.00,
      'expense': 0.0,
      'balance': 5000.00,
    },
    {
      'date': DateTime(2026, 8, 20),
      'description': 'Monthly salary',
      'category': 'Teacher Salary',
      'income': 0.0,
      'expense': 2500.00,
      'balance': 2500.00,
    },
    {
      'date': DateTime(2026, 8, 19),
      'description': 'Electricity bill',
      'category': 'Electricity',
      'income': 0.0,
      'expense': 500.00,
      'balance': 2000.00,
    },
  ];

  List<Map<String, dynamic>> get _filteredTransactions {
    return _transactions.where((item) {
      final date = item['date'] as DateTime;
      final matchesDate = (_filterStartDate == null || date.isAfter(_filterStartDate!.subtract(const Duration(days: 1)))) &&
          (_filterEndDate == null || date.isBefore(_filterEndDate!.add(const Duration(days: 1))));

      final matchesType = _filterType == 'all' ||
          (_filterType == 'income' && item['income'] > 0) ||
          (_filterType == 'expense' && item['expense'] > 0);

      return matchesDate && matchesType;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final filteredData = _filteredTransactions;
    final totalIncome = filteredData.fold<double>(0, (sum, item) => sum + (item['income'] as double));
    final totalExpense = filteredData.fold<double>(0, (sum, item) => sum + (item['expense'] as double));

    return ModernLayoutPro(
      title: 'Day Book',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Day Book - All Transactions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            const Text(
              'Chronological record of all financial transactions',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
            const SizedBox(height: 12),

            // Summary Cards
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Income',
                    amount: totalIncome,
                    color: Colors.green,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Expense',
                    amount: totalExpense,
                    color: Colors.red,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Net',
                    amount: totalIncome - totalExpense,
                    color: Colors.blue,
                    currencyFormat: currencyFormat,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2),

            // Filters
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
                    const Text('Filters', style: TextStyle(fontSize: 6, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Expanded(
                          child: DatePickerField(
                            label: 'From Date',
                            initialValue: _filterStartDate,
                            onDateChanged: (date) => setState(() => _filterStartDate = date),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: DatePickerField(
                            label: 'To Date',
                            initialValue: _filterEndDate,
                            onDateChanged: (date) => setState(() => _filterEndDate = date),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SegmentedButton<String>(
                      segments: const <ButtonSegment<String>>[
                        ButtonSegment<String>(
                          value: 'all',
                          label: Text('All'),
                          icon: Icon(Icons.list),
                        ),
                        ButtonSegment<String>(
                          value: 'income',
                          label: Text('Income'),
                          icon: Icon(Icons.arrow_upward),
                        ),
                        ButtonSegment<String>(
                          value: 'expense',
                          label: Text('Expense'),
                          icon: Icon(Icons.arrow_downward),
                        ),
                      ],
                      selected: <String>{_filterType},
                      onSelectionChanged: (Set<String> newSelection) {
                        setState(() => _filterType = newSelection.first);
                      },
                    ),
                    const SizedBox(height: 6),
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _filterStartDate = null;
                          _filterEndDate = null;
                          _filterType = 'all';
                        });
                      },
                      icon: const Icon(Icons.clear),
                      label: const Text('Clear Filters'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Data Table
            Card(
              elevation: 1,
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columns: const [
                    DataColumn(label: Text('Date')),
                    DataColumn(label: Text('Description')),
                    DataColumn(label: Text('Category')),
                    DataColumn(label: Text('Income'), numeric: true),
                    DataColumn(label: Text('Expense'), numeric: true),
                    DataColumn(label: Text('Balance'), numeric: true),
                  ],
                  rows: filteredData
                      .map(
                        (item) => DataRow(
                          cells: [
                            DataCell(Text(DateFormat('yyyy-MM-dd').format(item['date']))),
                            DataCell(Text(item['description'])),
                            DataCell(
                              Chip(
                                label: Text(item['category']),
                                backgroundColor: (item['income'] as double) > 0
                                    ? Colors.green.shade100
                                    : Colors.red.shade100,
                              ),
                            ),
                            DataCell(
                              Text(
                                (item['income'] as double) > 0
                                    ? 'AED ${currencyFormat.format(item['income'])}'
                                    : '-',
                                style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataCell(
                              Text(
                                (item['expense'] as double) > 0
                                    ? 'AED ${currencyFormat.format(item['expense'])}'
                                    : '-',
                                style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataCell(
                              Text(
                                'AED ${currencyFormat.format(item['balance'])}',
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                      )
                      .toList(),
                ),
              ),
            ),

            if (filteredData.isEmpty)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.inbox, size: 64, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      Text(
                        'No transactions found',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
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
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(
            'AED ${currencyFormat.format(amount)}',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    );
  }
}
