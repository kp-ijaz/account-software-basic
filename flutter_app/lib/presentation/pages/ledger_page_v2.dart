import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../widgets/common/modern_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class LedgerPageV2 extends StatefulWidget {
  const LedgerPageV2({super.key});

  @override
  State<LedgerPageV2> createState() => _LedgerPageV2State();
}

class _LedgerPageV2State extends State<LedgerPageV2> {
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _selectedCategory = '';
  String _filterType = 'all';

  final List<Map<String, dynamic>> _ledgerEntries = [
    {
      'date': DateTime(2026, 8, 20),
      'description': 'Student fee payment',
      'category': 'Student Fees',
      'debit': 5000.00,
      'credit': 0.0,
      'balance': 5000.00,
      'type': 'income',
    },
    {
      'date': DateTime(2026, 8, 20),
      'description': 'Monthly salary',
      'category': 'Teacher Salary',
      'debit': 0.0,
      'credit': 2500.00,
      'balance': 2500.00,
      'type': 'expense',
    },
    {
      'date': DateTime(2026, 8, 19),
      'description': 'Electricity bill',
      'category': 'Electricity',
      'debit': 0.0,
      'credit': 500.00,
      'balance': 2000.00,
      'type': 'expense',
    },
  ];

  final List<String> _categories = [
    'All Categories',
    'Student Fees',
    'Teacher Salary',
    'Electricity',
    'Donations',
    'Water',
  ];

  List<Map<String, dynamic>> get _filteredEntries {
    return _ledgerEntries.where((item) {
      final date = item['date'] as DateTime;
      final matchesDate = (_filterStartDate == null || date.isAfter(_filterStartDate!.subtract(const Duration(days: 1)))) &&
          (_filterEndDate == null || date.isBefore(_filterEndDate!.add(const Duration(days: 1))));

      final matchesCategory = _selectedCategory.isEmpty ||
          _selectedCategory == 'All Categories' ||
          item['category'] == _selectedCategory;

      final matchesType = _filterType == 'all' ||
          (_filterType == 'income' && item['type'] == 'income') ||
          (_filterType == 'expense' && item['type'] == 'expense');

      return matchesDate && matchesCategory && matchesType;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final filteredData = _filteredEntries;
    final totalDebit = filteredData.fold<double>(0, (sum, item) => sum + (item['debit'] as double));
    final totalCredit = filteredData.fold<double>(0, (sum, item) => sum + (item['credit'] as double));
    final currentBalance = filteredData.isNotEmpty
        ? (filteredData.last['balance'] as double)
        : 0.0;

    return ModernLayoutPro(
      title: 'Ledger',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Ledger', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
            const SizedBox(height: 1),
            const Text(
              'Detailed record of all debits and credits with running balance',
              style: TextStyle(fontSize: 5, color: Colors.grey),
            ),
            const SizedBox(height: 2),

            // Summary Cards
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Debits',
                    amount: totalDebit,
                    color: Colors.green,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 2),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Total Credits',
                    amount: totalCredit,
                    color: Colors.red,
                    currencyFormat: currencyFormat,
                  ),
                ),
                const SizedBox(width: 2),
                Expanded(
                  child: _buildSummaryCard(
                    title: 'Balance',
                    amount: currentBalance,
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
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            initialValue: _selectedCategory.isEmpty ? 'All Categories' : _selectedCategory,
                            decoration: InputDecoration(
                              labelText: 'Filter by Category',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            items: _categories
                                .map((cat) => DropdownMenuItem(value: cat, child: Text(cat)))
                                .toList(),
                            onChanged: (value) =>
                                setState(() => _selectedCategory = value == 'All Categories' ? '' : (value ?? '')),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: SegmentedButton<String>(
                            segments: const <ButtonSegment<String>>[
                              ButtonSegment<String>(
                                value: 'all',
                                label: Text('All'),
                              ),
                              ButtonSegment<String>(
                                value: 'income',
                                label: Text('Debit'),
                              ),
                              ButtonSegment<String>(
                                value: 'expense',
                                label: Text('Credit'),
                              ),
                            ],
                            selected: <String>{_filterType},
                            onSelectionChanged: (Set<String> newSelection) {
                              setState(() => _filterType = newSelection.first);
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _filterStartDate = null;
                          _filterEndDate = null;
                          _selectedCategory = '';
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

            // Ledger Table
            Card(
              elevation: 1,
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columns: const [
                    DataColumn(label: Text('Date')),
                    DataColumn(label: Text('Description')),
                    DataColumn(label: Text('Category')),
                    DataColumn(label: Text('Debit'), numeric: true),
                    DataColumn(label: Text('Credit'), numeric: true),
                    DataColumn(label: Text('Balance'), numeric: true),
                  ],
                  rows: filteredData
                      .map(
                        (entry) => DataRow(
                          cells: [
                            DataCell(Text(DateFormat('yyyy-MM-dd').format(entry['date']))),
                            DataCell(Text(entry['description'])),
                            DataCell(
                              Chip(
                                label: Text(entry['category']),
                                backgroundColor: entry['type'] == 'income'
                                    ? Colors.green.shade100
                                    : Colors.red.shade100,
                              ),
                            ),
                            DataCell(
                              Text(
                                (entry['debit'] as double) > 0
                                    ? 'AED ${currencyFormat.format(entry['debit'])}'
                                    : '-',
                                style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataCell(
                              Text(
                                (entry['credit'] as double) > 0
                                    ? 'AED ${currencyFormat.format(entry['credit'])}'
                                    : '-',
                                style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataCell(
                              Text(
                                'AED ${currencyFormat.format(entry['balance'])}',
                                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
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
                        'No ledger entries found',
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
