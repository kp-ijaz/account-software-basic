import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class ReportsPage extends StatefulWidget {
  const ReportsPage({Key? key}) : super(key: key);

  @override
  State<ReportsPage> createState() => _ReportsPageState();
}

class _ReportsPageState extends State<ReportsPage> {
  String _selectedReport = 'monthly';

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Reports',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            const SizedBox(height: AppSpacing.xxl),
            _buildReportSection(context),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Financial Reports',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'Generate and export financial reports',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: AppSpacing.lg),
        Row(
          children: [
            Expanded(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(value: 'monthly', label: Text('Monthly')),
                    ButtonSegment(value: 'yearly', label: Text('Yearly')),
                    ButtonSegment(value: 'balance', label: Text('Balance Sheet')),
                  ],
                  selected: {_selectedReport},
                  onSelectionChanged: (value) {
                    setState(() => _selectedReport = value.first);
                  },
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.lg),
            AppButton(
              label: 'Export PDF',
              icon: Icons.download,
              onPressed: () {},
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildReportSection(BuildContext context) {
    return AppSection(
      title: 'August 2026 Report',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: ScreenLayout.getGridColumnsForMetrics(context),
            crossAxisSpacing: AppSpacing.lg,
            mainAxisSpacing: AppSpacing.lg,
            childAspectRatio: 1.3,
            children: [
              _ReportCard(
                title: 'Total Income',
                value: 'AED 150,000',
                icon: Icons.trending_up,
                color: Colors.green,
              ),
              _ReportCard(
                title: 'Total Expenses',
                value: 'AED 75,000',
                icon: Icons.trending_down,
                color: Colors.red,
              ),
              _ReportCard(
                title: 'Net Balance',
                value: 'AED 75,000',
                icon: Icons.account_balance_wallet,
                color: Colors.blue,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ReportCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _ReportCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppSizing.cardBorderRadius),
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          left: BorderSide(color: color, width: 5),
        ),
        boxShadow: AppShadows.cardShadows,
      ),
      padding: AppSpacing.paddingLg,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: AppSizing.iconLarge),
          const SizedBox(height: AppSpacing.md),
          Text(
            title,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            value,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
        ],
      ),
    );
  }
}
