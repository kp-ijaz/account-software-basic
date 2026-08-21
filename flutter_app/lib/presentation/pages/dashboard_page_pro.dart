import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../widgets/common/app_layout_pro.dart';

class DashboardPagePro extends StatefulWidget {
  const DashboardPagePro({super.key});

  @override
  State<DashboardPagePro> createState() => _DashboardPageProState();
}

class _DashboardPageProState extends State<DashboardPagePro> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;
    final isTablet = size.width >= 768 && size.width < 1024;

    return AppLayoutPro(
      title: 'Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section
              Text(
                'Welcome back, Administrator',
                style: GoogleFonts.inter(
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                DateFormat('EEEE, MMMM d, yyyy').format(DateTime.now()),
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 32),

              // Primary Metrics Grid
              _buildMetricsGrid(isMobile, isTablet),
              const SizedBox(height: 32),

              // Summary Section
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (!isMobile)
                    Expanded(
                      flex: 2,
                      child: _buildRecentTransactions(isMobile),
                    ),
                  if (!isMobile) const SizedBox(width: 20),
                  Expanded(
                    flex: 1,
                    child: _buildQuickStats(isMobile),
                  ),
                ],
              ),

              if (isMobile) ...[
                const SizedBox(height: 24),
                _buildRecentTransactions(isMobile),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricsGrid(bool isMobile, bool isTablet) {
    return GridView(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: isMobile ? 1 : (isTablet ? 2 : 4),
        mainAxisSpacing: 20,
        crossAxisSpacing: 20,
        childAspectRatio: isMobile ? 1.2 : 1.3,
      ),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildMetricCard(
          title: "Today's Income",
          value: 'AED 5,000',
          subtitle: '+12% from yesterday',
          icon: Icons.trending_up_rounded,
          color: AppColors.success,
          bgColor: AppColors.success,
        ),
        _buildMetricCard(
          title: "Today's Expense",
          value: 'AED 2,500',
          subtitle: '-5% from yesterday',
          icon: Icons.trending_down_rounded,
          color: AppColors.error,
          bgColor: AppColors.error,
        ),
        _buildMetricCard(
          title: 'Cash Balance',
          value: 'AED 15,000',
          subtitle: 'On Hand',
          icon: Icons.wallet_rounded,
          color: AppColors.primary,
          bgColor: AppColors.primary,
        ),
        _buildMetricCard(
          title: 'Bank Balance',
          value: 'AED 85,500',
          subtitle: 'In Bank Account',
          icon: Icons.account_balance_rounded,
          color: const Color(0xFF8B5CF6),
          bgColor: const Color(0xFF8B5CF6),
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color bgColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      value,
                      style: GoogleFonts.inter(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        color: color,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: bgColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: bgColor, size: 28),
              ),
            ],
          ),
          Text(
            subtitle,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTransactions(bool isMobile) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Transactions',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'View All',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._buildTransactionList(),
        ],
      ),
    );
  }

  List<Widget> _buildTransactionList() {
    final transactions = [
      {
        'description': 'Student Fees',
        'amount': '+AED 5,000',
        'type': 'income',
        'time': '2 hours ago',
      },
      {
        'description': 'Teacher Salary',
        'amount': '-AED 2,500',
        'type': 'expense',
        'time': '4 hours ago',
      },
      {
        'description': 'Donation Received',
        'amount': '+AED 1,000',
        'type': 'income',
        'time': '1 day ago',
      },
    ];

    return transactions.asMap().entries.map((entry) {
      final isLast = entry.key == transactions.length - 1;
      final transaction = entry.value;
      final isIncome = transaction['type'] == 'income';

      return Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              border: Border(
                bottom: isLast
                    ? BorderSide.none
                    : BorderSide(color: AppColors.borderLight, width: 1),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        transaction['description'] as String,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        transaction['time'] as String,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  transaction['amount'] as String,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: isIncome ? AppColors.success : AppColors.error,
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    }).toList();
  }

  Widget _buildQuickStats(bool isMobile) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'This Month',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 20),
          _buildStatItem(
            label: 'Total Income',
            value: 'AED 125,000',
            color: AppColors.success,
            icon: Icons.add_circle_outline_rounded,
          ),
          const SizedBox(height: 16),
          _buildStatItem(
            label: 'Total Expense',
            value: 'AED 45,000',
            color: AppColors.error,
            icon: Icons.remove_circle_outline_rounded,
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Net Balance',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'AED 80,000',
                      style: GoogleFonts.inter(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                Icon(
                  Icons.trending_up_rounded,
                  color: AppColors.primary,
                  size: 28,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required String label,
    required String value,
    required Color color,
    required IconData icon,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
      ],
    );
  }
}
