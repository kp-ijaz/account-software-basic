import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class DayBookPage extends StatefulWidget {
  const DayBookPage({Key? key}) : super(key: key);

  @override
  State<DayBookPage> createState() => _DayBookPageState();
}

class _DayBookPageState extends State<DayBookPage> {
  String _filterDateRange = 'This Month';

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Day Book',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            const SizedBox(height: AppSpacing.xxl),
            _buildDayBookTable(),
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
          'Day Book',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'View all financial transactions chronologically',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: AppSpacing.lg),
        _buildFilterButtons(),
      ],
    );
  }

  Widget _buildFilterButtons() {
    final filters = ['Today', 'This Week', 'This Month', 'Custom'];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters
            .map((filter) => Padding(
                  padding: const EdgeInsets.only(right: AppSpacing.md),
                  child: FilterChip(
                    label: Text(filter),
                    selected: _filterDateRange == filter,
                    onSelected: (selected) {
                      setState(() => _filterDateRange = filter);
                    },
                  ),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildDayBookTable() {
    return AppSection(
      title: 'Transactions',
      child: AppDataTable(
        columns: const ['Date', 'Description', 'Category', 'Income', 'Expense', 'Balance'],
        rows: const [
          ['2026-08-20', 'Student fee payment', 'Student Fees', 'AED 5,000', '-', 'AED 5,000'],
          ['2026-08-20', 'Monthly salary', 'Teacher Salary', '-', 'AED 2,500', 'AED 2,500'],
          ['2026-08-19', 'Donations received', 'Donations', 'AED 3,000', '-', 'AED 5,500'],
          ['2026-08-19', 'Electricity bill', 'Electricity', '-', 'AED 800', 'AED 4,700'],
        ],
      ),
    );
  }
}
