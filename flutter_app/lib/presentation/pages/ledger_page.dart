import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class LedgerPage extends StatefulWidget {
  const LedgerPage({Key? key}) : super(key: key);

  @override
  State<LedgerPage> createState() => _LedgerPageState();
}

class _LedgerPageState extends State<LedgerPage> {
  String _selectedCategory = 'All';
  final List<String> _categories = ['All', 'Income', 'Expense'];

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Ledger',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            const SizedBox(height: AppSpacing.xxl),
            _buildLedgerTable(),
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
          'Ledger',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'View detailed debit and credit entries with running balances',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: AppSpacing.lg),
        _buildCategoryFilter(),
      ],
    );
  }

  Widget _buildCategoryFilter() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _categories
            .map((category) => Padding(
                  padding: const EdgeInsets.only(right: AppSpacing.md),
                  child: FilterChip(
                    label: Text(category),
                    selected: _selectedCategory == category,
                    onSelected: (selected) {
                      setState(() => _selectedCategory = category);
                    },
                  ),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildLedgerTable() {
    return AppSection(
      title: 'Transaction Details',
      child: AppDataTable(
        columns: const ['Date', 'Description', 'Debit', 'Credit', 'Balance'],
        rows: const [
          ['2026-08-20', 'Student fee payment', 'AED 5,000', '-', 'AED 5,000'],
          ['2026-08-20', 'Salary payment', '-', 'AED 2,500', 'AED 2,500'],
          ['2026-08-19', 'Donations received', 'AED 3,000', '-', 'AED 5,500'],
          ['2026-08-19', 'Electricity bill', '-', 'AED 800', 'AED 4,700'],
        ],
      ),
    );
  }
}
