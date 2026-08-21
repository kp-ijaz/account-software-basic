import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme/modern_theme.dart';

class ReportsMobile extends StatefulWidget {
  const ReportsMobile({super.key});

  @override
  State<ReportsMobile> createState() => _ReportsMobileState();
}

class _ReportsMobileState extends State<ReportsMobile> {
  int _selectedMonth = DateTime.now().month;
  int _selectedYear = DateTime.now().year;

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: ModernColors.darkBg,
      appBar: AppBar(
        backgroundColor: ModernColors.surfaceBg,
        title: Text('Reports', style: Theme.of(context).textTheme.titleLarge),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Month/Year Selection
            _buildDateSelector(context),
            const SizedBox(height: 16),

            // Monthly Summary
            _buildMonthlySummary(context),
            const SizedBox(height: 16),

            // Balance Sheet
            _buildBalanceSheet(context),
            const SizedBox(height: 16),

            // Monthly Breakdown
            _buildMonthlyBreakdown(context),
          ],
        ),
      ),
    );
  }

  Widget _buildDateSelector(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            DropdownButton<int>(
              value: _selectedMonth,
              items: List.generate(12, (index) {
                return DropdownMenuItem(
                  value: index + 1,
                  child: Text(DateFormat('MMMM').format(DateTime(2026, index + 1)), style: const TextStyle(fontSize: 12)),
                );
              }),
              onChanged: (value) {
                if (value != null) {
                  setState(() => _selectedMonth = value);
                }
              },
            ),
            DropdownButton<int>(
              value: _selectedYear,
              items: List.generate(5, (index) {
                final year = DateTime.now().year - 2 + index;
                return DropdownMenuItem(
                  value: year,
                  child: Text(year.toString(), style: const TextStyle(fontSize: 12)),
                );
              }),
              onChanged: (value) {
                if (value != null) {
                  setState(() => _selectedYear = value);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthlySummary(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Monthly Summary', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Total Income', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        Text(
                          'AED ${currencyFormat.format(50000)}',
                          style: const TextStyle(fontSize: 18, color: Colors.green, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('Total Expense', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        Text(
                          'AED ${currencyFormat.format(20000)}',
                          style: const TextStyle(fontSize: 18, color: Colors.red, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.blue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Net Balance', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      Text(
                        'AED ${currencyFormat.format(30000)}',
                        style: const TextStyle(fontSize: 18, color: Colors.blue, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBalanceSheet(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Balance Sheet', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Assets', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Cash', style: TextStyle(fontSize: 11)),
                    Text('AED ${currencyFormat.format(25000)}', style: const TextStyle(fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Bank', style: TextStyle(fontSize: 11)),
                    Text('AED ${currencyFormat.format(85500)}', style: const TextStyle(fontSize: 11)),
                  ],
                ),
                const Divider(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Assets', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    Text('AED ${currencyFormat.format(110500)}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMonthlyBreakdown(BuildContext context) {
    final months = [
      {'month': 'Jan', 'income': 45000, 'expense': 18000},
      {'month': 'Feb', 'income': 52000, 'expense': 21000},
      {'month': 'Mar', 'income': 48000, 'expense': 19000},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Yearly Breakdown', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...months
            .map((data) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            data['month'].toString(),
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '+${data['income'].toString()}',
                                style: const TextStyle(fontSize: 11, color: Colors.green),
                              ),
                              Text(
                                '-${data['expense'].toString()}',
                                style: const TextStyle(fontSize: 11, color: Colors.red),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ))
      ],
    );
  }
}
