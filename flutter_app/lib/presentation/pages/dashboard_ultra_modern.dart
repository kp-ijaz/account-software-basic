import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/modern_theme.dart';
import '../widgets/common/modern_layout_pro.dart';

class DashboardUltraModern extends StatefulWidget {
  const DashboardUltraModern({super.key});

  @override
  State<DashboardUltraModern> createState() => _DashboardUltraModernState();
}

class _DashboardUltraModernState extends State<DashboardUltraModern> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;
    final isTablet = size.width >= 768 && size.width < 1200;

    return ModernLayoutPro(
      title: 'Dashboard',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting Section
              _buildGreetingSection(isMobile),
              const SizedBox(height: 16),

              // Primary Metrics - Large Professional Cards
              _buildPrimaryMetrics(isMobile, isTablet),
              const SizedBox(height: 16),

              // Secondary Metrics Row
              if (!isMobile) ...[
                _buildSecondaryMetrics(),
                const SizedBox(height: 16),
              ],

              // Main Content Section
              if (!isMobile)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 2,
                      child: _buildTransactionsSection(),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      flex: 1,
                      child: _buildQuickInsights(),
                    ),
                  ],
                )
              else ...[
                _buildTransactionsSection(),
                const SizedBox(height: 16),
                _buildQuickInsights(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGreetingSection(bool isMobile) {
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          greeting,
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.w600,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Welcome',
          style: TextStyle(
            fontSize: isMobile ? 20 : 28,
            fontWeight: FontWeight.w800,
            color: Colors.black87,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Financial overview',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildPrimaryMetrics(bool isMobile, bool isTablet) {
    List<Map<String, dynamic>> metrics = [
      {
        'title': "Income",
        'value': '12.5K',
        'change': '+15%',
        'changePositive': true,
        'icon': Icons.trending_up_rounded,
        'gradient': LinearGradient(
          colors: [const Color(0xFF10B981), const Color(0xFF059669)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        'bgColor': const Color(0xFF10B981),
      },
      {
        'title': "Expense",
        'value': '5.2K',
        'change': '-8%',
        'changePositive': false,
        'icon': Icons.trending_down_rounded,
        'gradient': LinearGradient(
          colors: [const Color(0xFFEF4444), const Color(0xFFDC2626)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        'bgColor': const Color(0xFFEF4444),
      },
      {
        'title': 'Cash',
        'value': '25K',
        'change': 'Avail',
        'changePositive': true,
        'icon': Icons.wallet_rounded,
        'gradient': LinearGradient(
          colors: [const Color(0xFFFBBF24), const Color(0xFFF59E0B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        'bgColor': const Color(0xFFFBBF24),
      },
      {
        'title': 'Bank',
        'value': '85.5K',
        'change': 'Ok',
        'changePositive': true,
        'icon': Icons.account_balance_rounded,
        'gradient': LinearGradient(
          colors: [const Color(0xFF06B6D4), const Color(0xFF0891B2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        'bgColor': const Color(0xFF06B6D4),
      },
    ];

    int crossAxisCount = isMobile ? 1 : (isTablet ? 2 : 4);

    return GridView.count(
      crossAxisCount: crossAxisCount,
      mainAxisSpacing: 1,
      crossAxisSpacing: 1,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: isMobile ? 2.6 : 2.4,
      children: metrics
          .map((metric) => _buildPrimaryMetricCard(
                title: metric['title'],
                value: metric['value'],
                change: metric['change'],
                icon: metric['icon'],
                gradient: metric['gradient'],
              ))
          .toList(),
    );
  }

  Widget _buildPrimaryMetricCard({
    required String title,
    required String value,
    required String change,
    required IconData icon,
    required LinearGradient gradient,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: ModernColors.borderColor.withValues(alpha: 0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background gradient overlay
          Container(
            decoration: BoxDecoration(
              gradient: gradient.scale(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(3),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 6,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey,
                              letterSpacing: 0.2,
                            ),
                          ),
                          const SizedBox(height: 1),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                value,
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.black87,
                                  letterSpacing: -0.3,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        gradient: gradient,
                        borderRadius: BorderRadius.circular(6),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 3,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Icon(icon, color: Colors.white, size: 10),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    color: gradient.colors.first.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(
                      color: gradient.colors.first.withValues(alpha: 0.3),
                      width: 0.5,
                    ),
                  ),
                  child: Text(
                    change,
                    style: TextStyle(
                      fontSize: 6,
                      fontWeight: FontWeight.w700,
                      color: gradient.colors.first,
                      letterSpacing: 0.1,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSecondaryMetrics() {
    return Row(
      children: [
        Expanded(
          child: _buildSecondaryCard(
            'Monthly Income',
            'AED 125,000',
            Icons.trending_up_rounded,
            const Color(0xFF10B981),
          ),
        ),
        const SizedBox(width: 2),
        Expanded(
          child: _buildSecondaryCard(
            'Monthly Expense',
            'AED 45,000',
            Icons.trending_down_rounded,
            const Color(0xFFEF4444),
          ),
        ),
        const SizedBox(width: 2),
        Expanded(
          child: _buildSecondaryCard(
            'Monthly Balance',
            'AED 80,000',
            Icons.balance_rounded,
            const Color(0xFF6366F1),
          ),
        ),
      ],
    );
  }

  Widget _buildSecondaryCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: ModernColors.borderColor.withValues(alpha: 0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: ModernColors.textSecondary,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Icon(icon, color: color, size: 12),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: ModernColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionsSection() {
    final transactions = [
      {
        'category': 'Student Fees',
        'amount': '+AED 5,000',
        'time': '2 hours ago',
        'isIncome': true,
      },
      {
        'category': 'Teacher Salary',
        'amount': '-AED 2,500',
        'time': '4 hours ago',
        'isIncome': false,
      },
      {
        'category': 'Donation Received',
        'amount': '+AED 1,000',
        'time': '1 day ago',
        'isIncome': true,
      },
      {
        'category': 'Utilities Payment',
        'amount': '-AED 800',
        'time': '2 days ago',
        'isIncome': false,
      },
      {
        'category': 'Building Fund',
        'amount': '+AED 3,500',
        'time': '3 days ago',
        'isIncome': true,
      },
    ];

    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: ModernColors.borderColor.withValues(alpha: 0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Recent Transactions',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: ModernColors.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Latest financial activities',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: ModernColors.textTertiary,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  backgroundColor: ModernColors.primary.withValues(alpha: 0.1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'View All →',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: ModernColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 3),
          ...transactions.asMap().entries.map((e) {
            final idx = e.key;
            final tx = e.value;
            final isLast = idx == transactions.length - 1;

            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          gradient: tx['isIncome'] as bool
                              ? LinearGradient(
                                  colors: [
                                    const Color(0xFF10B981).withValues(alpha: 0.2),
                                    const Color(0xFF059669).withValues(alpha: 0.1),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                )
                              : LinearGradient(
                                  colors: [
                                    const Color(0xFFEF4444).withValues(alpha: 0.2),
                                    const Color(0xFFDC2626).withValues(alpha: 0.1),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Icon(
                            tx['isIncome'] as bool
                                ? Icons.arrow_downward_rounded
                                : Icons.arrow_upward_rounded,
                            color: tx['isIncome'] as bool
                                ? const Color(0xFF10B981)
                                : const Color(0xFFEF4444),
                            size: 16,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tx['category'] as String,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: ModernColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              tx['time'] as String,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w400,
                                color: ModernColors.textTertiary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        tx['amount'] as String,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: tx['isIncome'] as bool
                              ? const Color(0xFF10B981)
                              : const Color(0xFFEF4444),
                          letterSpacing: -0.2,
                        ),
                      ),
                    ],
                  ),
                ),
                if (!isLast)
                  Divider(
                    color: ModernColors.borderColor.withValues(alpha: 0.2),
                    height: 1,
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildQuickInsights() {
    return Column(
      children: [
        _buildInsightCard(
          'Monthly Overview',
          [
            {'label': 'Total Income', 'value': 'AED 125,000', 'icon': Icons.trending_up_rounded, 'color': const Color(0xFF10B981)},
            {'label': 'Total Expense', 'value': 'AED 45,000', 'icon': Icons.trending_down_rounded, 'color': const Color(0xFFEF4444)},
          ],
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            gradient: ModernTheme.primaryGradient,
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 3,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Net Balance',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.white70,
                      letterSpacing: 0.2,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      '+24%',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'AED 80,000',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Available balance after all transactions',
                style: TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.w400,
                  color: Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInsightCard(String title, List<Map<String, dynamic>> items) {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: ModernColors.borderColor.withValues(alpha: 0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: ModernColors.textPrimary,
            ),
          ),
          const SizedBox(height: 10),
          ...items.asMap().entries.map((e) {
            final isLast = e.key == items.length - 1;
            final item = e.value;

            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item['label'] as String,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: ModernColors.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            item['value'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: item['color'] as Color,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: (item['color'] as Color).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Icon(
                          item['icon'] as IconData,
                          color: item['color'] as Color,
                          size: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                if (!isLast)
                  Divider(
                    color: ModernColors.borderColor.withValues(alpha: 0.2),
                    height: 1,
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }
}
