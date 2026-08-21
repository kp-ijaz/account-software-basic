import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/modern_theme.dart';
import '../widgets/common/modern_layout_pro.dart';

class DashboardUnified extends StatefulWidget {
  const DashboardUnified({super.key});

  @override
  State<DashboardUnified> createState() => _DashboardUnifiedState();
}

class _DashboardUnifiedState extends State<DashboardUnified> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 600;
    final isTablet = size.width >= 600 && size.width < 1200;
    final isDesktop = size.width >= 1200;

    // Responsive values
    final padding = isMobile ? 6.0 : (isTablet ? 8.0 : 12.0);
    final gridColumns = isMobile ? 2 : (isTablet ? 3 : 4);
    final cardAspect = isMobile ? 2.4 : (isTablet ? 2.2 : 2.0);

    return ModernLayoutPro(
      title: 'Dashboard',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(padding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting
              _buildGreeting(isMobile),
              const SizedBox(height: 2),

              // Metric Cards Grid
              _buildMetricsGrid(gridColumns, cardAspect),
              const SizedBox(height: 2),

              // Today Summary
              _buildTodaySummary(),
              const SizedBox(height: 2),

              // Balance Overview
              _buildBalanceOverview(),
              const SizedBox(height: 2),

              // Recent Transactions
              _buildRecentTransactions(isDesktop),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGreeting(bool isMobile) {
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

    return Row(
      children: [
        Text(greeting, style: const TextStyle(fontSize: 12)),
        const SizedBox(width: 3),
        const Text('Welcome', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildMetricsGrid(int columns, double aspectRatio) {
    return GridView.count(
      crossAxisCount: columns,
      mainAxisSpacing: 1,
      crossAxisSpacing: 1,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: aspectRatio,
      children: [
        _buildMetricCard('Income', '12.5K', Icons.trending_up_rounded, Colors.green),
        _buildMetricCard('Expense', '5.2K', Icons.trending_down_rounded, Colors.red),
        _buildMetricCard('Cash', '25K', Icons.wallet_rounded, Colors.orange),
        _buildMetricCard('Bank', '85.5K', Icons.account_balance_rounded, Colors.blue),
      ],
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1), width: 1),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 3, offset: const Offset(0, 1)),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 3),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontSize: 7, fontWeight: FontWeight.w600),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Icon(icon, size: 9, color: color),
              ],
            ),
            Text(
              value,
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: color),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTodaySummary() {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1), width: 1),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 3, offset: const Offset(0, 1)),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 2),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Today", style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold)),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Inc', style: TextStyle(fontSize: 6, color: Colors.grey)),
                    const Text('12.5K', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.green)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Exp', style: TextStyle(fontSize: 6, color: Colors.grey)),
                    const Text('5.2K', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.red)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text('Net', style: TextStyle(fontSize: 6, color: Colors.grey)),
                    const Text('7.3K', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.blue)),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceOverview() {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1), width: 1),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 3, offset: const Offset(0, 1)),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 2),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Month', style: TextStyle(fontSize: 6, color: Colors.grey)),
                const Text('50K', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold)),
              ],
            ),
            Icon(Icons.trending_up_rounded, size: 10, color: Colors.green),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentTransactions(bool isDesktop) {
    final transactions = [
      {'name': 'Student Fee', 'amount': '+5K', 'time': '2:30 PM', 'type': 'income'},
      {'name': 'Salary', 'amount': '-2.5K', 'time': '1:15 PM', 'type': 'expense'},
      {'name': 'Donation', 'amount': '+1K', 'time': '12:00 PM', 'type': 'income'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Recent', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold)),
        ...transactions
            .map((tx) => Container(
                  margin: const EdgeInsets.only(top: 1),
                  decoration: BoxDecoration(
                    color: ModernColors.cardBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.grey.withValues(alpha: 0.1), width: 1),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 3, offset: const Offset(0, 1)),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 2),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                tx['name']!,
                                style: const TextStyle(fontSize: 7, fontWeight: FontWeight.bold),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                tx['time']!,
                                style: const TextStyle(fontSize: 6, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          tx['amount']!,
                          style: TextStyle(
                            fontSize: 7,
                            color: tx['type'] == 'income' ? Colors.green : Colors.red,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ))
            .toList(),
      ],
    );
  }
}
