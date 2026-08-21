import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class AuditLogPage extends StatefulWidget {
  const AuditLogPage({Key? key}) : super(key: key);

  @override
  State<AuditLogPage> createState() => _AuditLogPageState();
}

class _AuditLogPageState extends State<AuditLogPage> {
  String _selectedAction = 'All';
  final List<String> _actions = ['All', 'Login', 'Logout', 'Create', 'Update', 'Delete'];

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Audit Log',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            const SizedBox(height: AppSpacing.xxl),
            _buildAuditLogTable(),
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
          'Audit Log',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'View all system activities and changes',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: AppSpacing.lg),
        _buildActionFilter(),
      ],
    );
  }

  Widget _buildActionFilter() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _actions
            .map((action) => Padding(
                  padding: const EdgeInsets.only(right: AppSpacing.md),
                  child: FilterChip(
                    label: Text(action),
                    selected: _selectedAction == action,
                    onSelected: (selected) {
                      setState(() => _selectedAction = action);
                    },
                  ),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildAuditLogTable() {
    return AppSection(
      title: 'Audit Trail',
      child: AppDataTable(
        columns: const ['Date', 'Time', 'Action', 'Description', 'User'],
        rows: const [
          ['2026-08-20', '14:30:45', 'Income Created', 'Student fee - AED 5,000', 'Admin'],
          ['2026-08-20', '14:15:30', 'Login', 'Admin logged in', 'Admin'],
          ['2026-08-20', '10:45:12', 'Expense Created', 'Salary payment - AED 2,500', 'Admin'],
          ['2026-08-19', '16:22:08', 'Settings Updated', 'Madrasa name changed', 'Admin'],
          ['2026-08-19', '09:00:00', 'Login', 'Admin logged in', 'Admin'],
        ],
      ),
    );
  }
}
