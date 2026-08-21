import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme/modern_theme.dart';
import '../widgets/common/date_picker_field.dart';

class IncomeExpenseCombinedMobile extends StatefulWidget {
  const IncomeExpenseCombinedMobile({super.key});

  @override
  State<IncomeExpenseCombinedMobile> createState() => _IncomeExpenseCombinedMobileState();
}

class _IncomeExpenseCombinedMobileState extends State<IncomeExpenseCombinedMobile>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _selectedCategory = '';

  final List<Map<String, dynamic>> _incomeData = [
    {
      'date': DateTime(2026, 8, 20),
      'category': 'Student Fees',
      'description': 'Monthly fees',
      'amount': 12500.00,
      'method': 'Bank',
    },
  ];

  final List<Map<String, dynamic>> _expenseData = [
    {
      'date': DateTime(2026, 8, 20),
      'category': 'Teacher Salary',
      'description': 'Monthly salary',
      'amount': 2500.00,
      'method': 'Bank',
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
    final isMobile = MediaQuery.of(context).size.width < 768;

    return Scaffold(
      backgroundColor: ModernColors.darkBg,
      appBar: AppBar(
        backgroundColor: ModernColors.surfaceBg,
        title: Text('Income & Expenses', style: Theme.of(context).textTheme.titleLarge),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Income', icon: Icon(Icons.trending_up_rounded)),
            Tab(text: 'Expenses', icon: Icon(Icons.trending_down_rounded)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildIncomeTab(isMobile),
          _buildExpenseTab(isMobile),
        ],
      ),
    );
  }

  Widget _buildIncomeTab(bool isMobile) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final total = _incomeData.fold<double>(0, (sum, item) => sum + (item['amount'] as double));

    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Total Income', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Text(
                    'AED ${currencyFormat.format(total)}',
                    style: const TextStyle(
                      fontSize: 18,
                      color: Colors.green,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Add Income'),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 40),
              backgroundColor: Colors.green,
              textStyle: const TextStyle(fontSize: 12),
            ),
          ),
          const SizedBox(height: 12),
          _buildTransactionsList(_incomeData, 'Income'),
        ],
      ),
    );
  }

  Widget _buildExpenseTab(bool isMobile) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final total = _expenseData.fold<double>(0, (sum, item) => sum + (item['amount'] as double));

    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Total Expenses', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Text(
                    'AED ${currencyFormat.format(total)}',
                    style: const TextStyle(
                      fontSize: 18,
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Add Expense'),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 40),
              backgroundColor: Colors.red,
              textStyle: const TextStyle(fontSize: 12),
            ),
          ),
          const SizedBox(height: 12),
          _buildTransactionsList(_expenseData, 'Expense'),
        ],
      ),
    );
  }

  Widget _buildTransactionsList(List<Map<String, dynamic>> data, String type) {
    if (data.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Text('No $type transactions', style: const TextStyle(fontSize: 12)),
        ),
      );
    }

    return Column(
      children: data
          .map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item['category'],
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item['description'],
                                style: const TextStyle(fontSize: 11),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                DateFormat('dd MMM yyyy').format(item['date']),
                                style: const TextStyle(fontSize: 11, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          'AED ${(item['amount'] as double).toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: type == 'Income' ? Colors.green : Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ))
          .toList(),
    );
  }
}
