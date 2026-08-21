import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme/modern_theme.dart';

class LedgerDayBookCombinedMobile extends StatefulWidget {
  const LedgerDayBookCombinedMobile({super.key});

  @override
  State<LedgerDayBookCombinedMobile> createState() => _LedgerDayBookCombinedMobileState();
}

class _LedgerDayBookCombinedMobileState extends State<LedgerDayBookCombinedMobile>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _dayBookEntries = [
    {
      'date': DateTime(2026, 8, 20),
      'description': 'Student fee payment',
      'category': 'Student Fees',
      'type': 'income',
      'amount': 5000.00,
      'balance': 5000.00,
    },
    {
      'date': DateTime(2026, 8, 20),
      'description': 'Monthly salary',
      'category': 'Teacher Salary',
      'type': 'expense',
      'amount': 2500.00,
      'balance': 2500.00,
    },
  ];

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
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ModernColors.darkBg,
      appBar: AppBar(
        backgroundColor: ModernColors.surfaceBg,
        title: Text('Ledger & Day Book', style: Theme.of(context).textTheme.titleLarge),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Day Book', icon: Icon(Icons.calendar_today_rounded)),
            Tab(text: 'Ledger', icon: Icon(Icons.receipt_long_rounded)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDayBookTab(),
          _buildLedgerTab(),
        ],
      ),
    );
  }

  Widget _buildDayBookTab() {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Transactions', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ..._dayBookEntries
              .map((entry) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  DateFormat('dd MMM yyyy').format(entry['date']),
                                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: entry['type'] == 'income'
                                        ? Colors.green.withValues(alpha: 0.2)
                                        : Colors.red.withValues(alpha: 0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    entry['type'] == 'income' ? 'Income' : 'Expense',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: entry['type'] == 'income' ? Colors.green : Colors.red,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              entry['description'],
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              entry['category'],
                              style: const TextStyle(fontSize: 11),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'AED ${currencyFormat.format(entry['amount'])}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: entry['type'] == 'income' ? Colors.green : Colors.red,
                                  ),
                                ),
                                Text(
                                  'Balance: AED ${currencyFormat.format(entry['balance'])}',
                                  style: const TextStyle(fontSize: 11, color: Colors.blue),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ))
              .toList(),
        ],
      ),
    );
  }

  Widget _buildLedgerTab() {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final totalDebit =
        _ledgerEntries.fold<double>(0, (sum, item) => sum + (item['debit'] as double));
    final totalCredit =
        _ledgerEntries.fold<double>(0, (sum, item) => sum + (item['credit'] as double));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Debits', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 8),
                        Text(
                          'AED ${currencyFormat.format(totalDebit)}',
                          style: const TextStyle(fontSize: 18, color: Colors.green, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Credits', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 8),
                        Text(
                          'AED ${currencyFormat.format(totalCredit)}',
                          style: const TextStyle(fontSize: 18, color: Colors.red, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text('Entries', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ..._ledgerEntries
              .map((entry) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  DateFormat('dd MMM yyyy').format(entry['date']),
                                  style: const TextStyle(fontSize: 11),
                                ),
                                Text(
                                  entry['category'],
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              entry['description'],
                              style: const TextStyle(fontSize: 11),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                if ((entry['debit'] as double) > 0)
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Debit', style: TextStyle(fontSize: 11)),
                                      Text(
                                        'AED ${currencyFormat.format(entry['debit'])}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.green,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                if ((entry['credit'] as double) > 0)
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Credit', style: TextStyle(fontSize: 11)),
                                      Text(
                                        'AED ${currencyFormat.format(entry['credit'])}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.red,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    const Text('Balance', style: TextStyle(fontSize: 11)),
                                    Text(
                                      'AED ${currencyFormat.format(entry['balance'])}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.blue,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ))
        ],
      ),
    );
  }
}
