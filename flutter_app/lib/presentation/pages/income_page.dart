import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class IncomePage extends StatefulWidget {
  const IncomePage({Key? key}) : super(key: key);

  @override
  State<IncomePage> createState() => _IncomePageState();
}

class _IncomePageState extends State<IncomePage> {
  String? _selectedCategory;
  String? _selectedPaymentMethod;

  final List<String> _categories = [
    'Student Fees',
    'Donations',
    'Zakat',
    'Sadaqah',
    'Sponsorship',
    'Building Fund',
    'Other Income',
  ];

  final List<String> _paymentMethods = ['Cash', 'Bank'];

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Income',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            const SizedBox(height: AppSpacing.xxl),
            _buildTransactionsSection(context),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderSection(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Income Transactions',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Manage and track all income entries',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
        const SizedBox(width: AppSpacing.lg),
        AppButton(
          label: 'Add Income',
          icon: Icons.add,
          onPressed: () => _showAddIncomeDialog(context),
        ),
      ],
    );
  }

  Widget _buildTransactionsSection(BuildContext context) {
    return AppSection(
      title: 'Recent Income Entries',
      child: AppDataTable(
        columns: const ['Date', 'Category', 'Description', 'Amount', 'Method', 'Actions'],
        rows: const [
          ['2026-08-20', 'Student Fees', 'Monthly tuition', 'AED 5,000', 'Bank', 'Edit • Delete'],
          ['2026-08-19', 'Donations', 'General donation', 'AED 3,000', 'Cash', 'Edit • Delete'],
          ['2026-08-18', 'Zakat', 'Zakat contribution', 'AED 2,000', 'Bank', 'Edit • Delete'],
        ],
      ),
    );
  }

  void _showAddIncomeDialog(BuildContext context) {
    final isMobile = ScreenLayout.isMobile(context);

    if (isMobile) {
      _showMobileIncomeSheet(context);
    } else {
      _showDesktopIncomeDialog(context);
    }
  }

  void _showDesktopIncomeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Income'),
        contentPadding: const EdgeInsets.all(24),
        content: SizedBox(
          width: 500,
          child: _buildIncomeForm(context),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          AppButton(
            label: 'Save',
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  void _showMobileIncomeSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: AppSpacing.lg,
          right: AppSpacing.lg,
          top: AppSpacing.lg,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Add Income',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: AppSpacing.lg),
            _buildIncomeForm(context),
            const SizedBox(height: AppSpacing.lg),
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    label: 'Cancel',
                    variant: ButtonVariant.secondary,
                    isFullWidth: true,
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
                const SizedBox(width: AppSpacing.lg),
                Expanded(
                  child: AppButton(
                    label: 'Save',
                    isFullWidth: true,
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
          ],
        ),
      ),
    );
  }

  Widget _buildIncomeForm(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Date',
              prefixIcon: const Icon(Icons.calendar_today),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
              ),
            ),
            readOnly: true,
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime.now(),
              );
              if (date != null) {
                // Update date
              }
            },
          ),
          const SizedBox(height: AppSpacing.lg),
          DropdownButtonFormField<String>(
            value: _selectedCategory,
            decoration: InputDecoration(
              labelText: 'Category',
              prefixIcon: const Icon(Icons.category),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
              ),
            ),
            items: _categories
                .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                .toList(),
            onChanged: (value) => setState(() => _selectedCategory = value),
          ),
          const SizedBox(height: AppSpacing.lg),
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Description',
              prefixIcon: const Icon(Icons.description),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
              ),
            ),
            maxLines: 2,
          ),
          const SizedBox(height: AppSpacing.lg),
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Amount',
              prefixIcon: const Icon(Icons.attach_money),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
              ),
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: AppSpacing.lg),
          DropdownButtonFormField<String>(
            value: _selectedPaymentMethod,
            decoration: InputDecoration(
              labelText: 'Payment Method',
              prefixIcon: const Icon(Icons.payment),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
              ),
            ),
            items: _paymentMethods
                .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                .toList(),
            onChanged: (value) => setState(() => _selectedPaymentMethod = value),
          ),
        ],
      ),
    );
  }
}
