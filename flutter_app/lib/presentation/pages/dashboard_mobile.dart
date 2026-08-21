import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme/modern_theme.dart';

class DashboardMobile extends StatelessWidget {
  const DashboardMobile({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 600;

    return Scaffold(
      backgroundColor: ModernColors.darkBg,
      appBar: AppBar(
        backgroundColor: ModernColors.surfaceBg,
        title: Text('Dashboard', style: Theme.of(context).textTheme.titleLarge),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildGreeting(context),
            const SizedBox(height: 16),
            _buildQuickMetrics(context, isMobile),
            const SizedBox(height: 16),
            _buildTodaySummary(context, isMobile),
            const SizedBox(height: 16),
            _buildBalanceOverview(context, isMobile),
            const SizedBox(height: 16),
            _buildRecentTransactions(context, isMobile),
          ],
        ),
      ),
    );
  }

  Widget _buildGreeting(BuildContext context) {
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

    return Row(
      children: [
        Text(greeting, style: const TextStyle(fontSize: 28)),
        const SizedBox(width: 12),
        const Text('Welcome', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildQuickMetrics(BuildContext context, bool isMobile) {
    return GridView.count(
      crossAxisCount: 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.8,
      children: [
        _buildMetricCard(context, 'Income', '12.5K', Icons.trending_up_rounded, Colors.green),
        _buildMetricCard(context, 'Expense', '5.2K', Icons.trending_down_rounded, Colors.red),
        _buildMetricCard(context, 'Cash', '25K', Icons.wallet_rounded, Colors.orange),
        _buildMetricCard(context, 'Bank', '85.5K', Icons.account_balance_rounded, Colors.blue),
      ],
    );
  }

  Widget _buildMetricCard(
    BuildContext context,
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Icon(icon, size: 20, color: color),
              ],
            ),
            Text(
              value,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTodaySummary(BuildContext context, bool isMobile) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Today", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Income', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    const Text('12.5K', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Expense', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    const Text('5.2K', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.red)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text('Net', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    const Text('7.3K', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blue)),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceOverview(BuildContext context, bool isMobile) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Monthly Balance', style: TextStyle(fontSize: 11, color: Colors.grey)),
                const Text('50K', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            Icon(Icons.trending_up_rounded, size: 28, color: Colors.green),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentTransactions(BuildContext context, bool isMobile) {
    final transactions = [
      {'name': 'Student Fee', 'amount': '+5K', 'time': '2:30 PM', 'type': 'income'},
      {'name': 'Salary', 'amount': '-2.5K', 'time': '1:15 PM', 'type': 'expense'},
      {'name': 'Donation', 'amount': '+1K', 'time': '12:00 PM', 'type': 'income'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Recent Transactions', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        ...transactions
            .map((tx) => Padding(
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
                                  tx['name']!,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  tx['time']!,
                                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            tx['amount']!,
                            style: TextStyle(
                              fontSize: 12,
                              color: tx['type'] == 'income' ? Colors.green : Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ))
            .toList(),
      ],
    );
  }
}
