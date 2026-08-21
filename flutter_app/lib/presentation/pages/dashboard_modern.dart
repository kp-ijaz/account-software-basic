import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/modern_theme.dart';
import '../widgets/common/modern_layout.dart';

class DashboardModern extends StatefulWidget {
  const DashboardModern({super.key});

  @override
  State<DashboardModern> createState() => _DashboardModernState();
}

class _DashboardModernState extends State<DashboardModern> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;
    final isTablet = size.width >= 768 && size.width < 1200;

    return ModernLayout(
      title: 'Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : (isTablet ? 24 : 32)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: ModernColors.textSecondary,
                    ),
                  ),
                  Text(
                    'Administrator',
                    style: GoogleFonts.poppins(
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: FontWeight.w800,
                      color: ModernColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Main Metrics - Responsive Grid
              LayoutBuilder(
                builder: (context, constraints) {
                  int crossAxisCount = 1;
                  if (isMobile) {
                    crossAxisCount = 1;
                  } else if (isTablet) {
                    crossAxisCount = 2;
                  } else {
                    crossAxisCount = 4;
                  }

                  return GridView.count(
                    crossAxisCount: crossAxisCount,
                    mainAxisSpacing: 20,
                    crossAxisSpacing: 20,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      _buildMetricCard(
                        title: "Today's Income",
                        value: 'AED 12,500',
                        change: '+15%',
                        icon: Icons.trending_up_rounded,
                        gradient: ModernTheme.successGradient,
                        backgroundColor: const Color(0xFF10B981).withOpacity(0.1),
                      ),
                      _buildMetricCard(
                        title: "Today's Expense",
                        value: 'AED 5,200',
                        change: '-8%',
                        icon: Icons.trending_down_rounded,
                        gradient: ModernTheme.errorGradient,
                        backgroundColor: const Color(0xFFEF4444).withOpacity(0.1),
                      ),
                      _buildMetricCard(
                        title: 'Cash Balance',
                        value: 'AED 25,000',
                        change: 'Available',
                        icon: Icons.wallet_rounded,
                        gradient: LinearGradient(
                          colors: [const Color(0xFFFBBF24), const Color(0xFFF59E0B)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        backgroundColor: const Color(0xFFFBBF24).withOpacity(0.1),
                      ),
                      _buildMetricCard(
                        title: 'Bank Balance',
                        value: 'AED 85,500',
                        change: 'Confirmed',
                        icon: Icons.account_balance_rounded,
                        gradient: LinearGradient(
                          colors: [const Color(0xFF06B6D4), const Color(0xFF0891B2)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        backgroundColor: const Color(0xFF06B6D4).withOpacity(0.1),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 32),

              // Content Section - Responsive Layout
              if (!isMobile) ...[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 2,
                      child: _buildRecentTransactions(),
                    ),
                    const SizedBox(width: 24),
                    Expanded(
                      flex: 1,
                      child: _buildQuickStats(),
                    ),
                  ],
                ),
              ] else ...[
                _buildRecentTransactions(),
                const SizedBox(height: 24),
                _buildQuickStats(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String change,
    required IconData icon,
    required LinearGradient gradient,
    required Color backgroundColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: ModernColors.borderColor.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: ModernColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    value,
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: ModernColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: gradient,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Icon(icon, color: Colors.white, size: 24),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              change,
              style: GoogleFonts.poppins(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: ModernColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTransactions() {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: ModernColors.borderColor.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Transactions',
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: ModernColors.textPrimary,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'View All',
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: ModernColors.accentPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...[
            ('Student Fees', '+AED 5,000', '2 hours ago', true),
            ('Teacher Salary', '-AED 2,500', '4 hours ago', false),
            ('Donation', '+AED 1,000', '1 day ago', true),
          ].asMap().entries.map((e) {
            final isLast = e.key == 2;
            final (desc, amount, time, isIncome) = e.value;
            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            desc,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: ModernColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            time,
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: ModernColors.textTertiary,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        amount,
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: isIncome
                              ? const Color(0xFF10B981)
                              : const Color(0xFFEF4444),
                        ),
                      ),
                    ],
                  ),
                ),
                if (!isLast)
                  Divider(
                    color: ModernColors.borderColor.withOpacity(0.3),
                    height: 1,
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildQuickStats() {
    return Container(
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: ModernColors.borderColor.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'This Month',
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: ModernColors.textPrimary,
            ),
          ),
          const SizedBox(height: 24),
          ...[
            ('Total Income', 'AED 125,000', ModernColors.success, Icons.trending_up_rounded),
            ('Total Expense', 'AED 45,000', ModernColors.error, Icons.trending_down_rounded),
          ].map((stat) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        stat.$1,
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: ModernColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        stat.$2,
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: stat.$3,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: stat.$3.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(stat.$4, color: stat.$3, size: 18),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              gradient: ModernTheme.primaryGradient,
              borderRadius: BorderRadius.circular(14),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Net Balance',
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'AED 80,000',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
