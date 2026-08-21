import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Dashboard',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTodaySection(context),
            _buildMonthSection(context),
            _buildBalancesSection(context),
            _buildRecentTransactionsSection(context),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  Widget _buildTodaySection(BuildContext context) {
    return AppSection(
      title: 'Today\'s Summary',
      child: _buildMetricGrid(
        context,
        [
          _MetricData(
            title: 'Income',
            value: 'AED 5,000',
            color: Colors.green,
            icon: Icons.trending_up,
          ),
          _MetricData(
            title: 'Expenses',
            value: 'AED 2,500',
            color: Colors.red,
            icon: Icons.trending_down,
          ),
          _MetricData(
            title: 'Balance',
            value: 'AED 2,500',
            color: Colors.blue,
            icon: Icons.account_balance_wallet,
          ),
        ],
      ),
    );
  }

  Widget _buildMonthSection(BuildContext context) {
    return AppSection(
      title: 'This Month\'s Summary',
      child: _buildMetricGrid(
        context,
        [
          _MetricData(
            title: 'Total Income',
            value: 'AED 150,000',
            color: Colors.green,
            icon: Icons.trending_up,
          ),
          _MetricData(
            title: 'Total Expenses',
            value: 'AED 75,000',
            color: Colors.red,
            icon: Icons.trending_down,
          ),
          _MetricData(
            title: 'Month Balance',
            value: 'AED 75,000',
            color: Colors.blue,
            icon: Icons.account_balance_wallet,
          ),
        ],
      ),
    );
  }

  Widget _buildBalancesSection(BuildContext context) {
    return AppSection(
      title: 'Account Balances',
      child: _buildMetricGrid(
        context,
        [
          _MetricData(
            title: 'Cash Balance',
            value: 'AED 50,000',
            color: Colors.purple,
            icon: Icons.local_atm,
          ),
          _MetricData(
            title: 'Bank Balance',
            value: 'AED 150,000',
            color: Colors.indigo,
            icon: Icons.account_balance,
          ),
          _MetricData(
            title: 'Total Balance',
            value: 'AED 200,000',
            color: Colors.teal,
            icon: Icons.summarize,
          ),
        ],
      ),
    );
  }

  Widget _buildMetricGrid(BuildContext context, List<_MetricData> metrics) {
    final columns = ScreenLayout.getGridColumnsForMetrics(context);
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: columns,
        childAspectRatio: 1.2,
        crossAxisSpacing: AppSpacing.lg,
        mainAxisSpacing: AppSpacing.lg,
      ),
      itemCount: metrics.length,
      itemBuilder: (context, index) => AppMetricCard(
        title: metrics[index].title,
        value: metrics[index].value,
        color: metrics[index].color,
        icon: metrics[index].icon,
      ),
    );
  }

  Widget _buildRecentTransactionsSection(BuildContext context) {
    return AppSection(
      title: 'Recent Transactions',
      onViewAll: () {},
      child: _buildRecentTransactionsTable(),
    );
  }

  Widget _buildRecentTransactionsTable() {
    return AppDataTable(
      columns: const ['Date', 'Description', 'Category', 'Type', 'Amount'],
      rows: const [
        ['2026-08-20', 'Student fee payment', 'Student Fees', 'Income', '+ AED 5,000'],
        ['2026-08-20', 'Monthly salary', 'Teacher Salary', 'Expense', '- AED 2,500'],
        ['2026-08-19', 'Donations received', 'Donations', 'Income', '+ AED 3,000'],
        ['2026-08-19', 'Electricity bill', 'Electricity', 'Expense', '- AED 800'],
      ],
    );
  }
}

class _MetricData {
  final String title;
  final String value;
  final Color color;
  final IconData icon;

  _MetricData({
    required this.title,
    required this.value,
    required this.color,
    required this.icon,
  });
}
