import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../widgets/common/app_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class IncomePagePro extends StatefulWidget {
  const IncomePagePro({super.key});

  @override
  State<IncomePagePro> createState() => _IncomePageProState();
}

class _IncomePageProState extends State<IncomePagePro> {
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _selectedCategory = '';
  String _searchTerm = '';

  final List<Map<String, dynamic>> _incomeData = [
    {
      'date': DateTime(2026, 8, 20),
      'category': 'Student Fees',
      'description': 'Monthly tuition fees',
      'amount': 5000.00,
      'method': 'Bank',
    },
    {
      'date': DateTime(2026, 8, 19),
      'category': 'Donations',
      'description': 'Generous donation',
      'amount': 2000.00,
      'method': 'Cash',
    },
    {
      'date': DateTime(2026, 8, 18),
      'category': 'Sponsorship',
      'description': 'Monthly sponsorship',
      'amount': 1500.00,
      'method': 'Bank',
    },
  ];

  final List<String> _categories = [
    'Student Fees',
    'Donations',
    'Zakat',
    'Sadaqah',
    'Sponsorship',
    'Building Fund',
    'Other Income',
  ];

  List<Map<String, dynamic>> get _filteredData {
    return _incomeData.where((item) {
      final date = item['date'] as DateTime;
      final matchesDateRange = (_filterStartDate == null || date.isAfter(_filterStartDate!.subtract(const Duration(days: 1)))) &&
          (_filterEndDate == null || date.isBefore(_filterEndDate!.add(const Duration(days: 1))));
      final matchesCategory = _selectedCategory.isEmpty || item['category'] == _selectedCategory;
      final matchesSearch = _searchTerm.isEmpty ||
          (item['description'] as String).toLowerCase().contains(_searchTerm.toLowerCase()) ||
          (item['category'] as String).toLowerCase().contains(_searchTerm.toLowerCase());
      return matchesDateRange && matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final totalIncome = _filteredData.fold<double>(0, (sum, item) => sum + (item['amount'] as double));
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    return AppLayoutPro(
      title: 'Income',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Income Transactions',
                        style: GoogleFonts.inter(
                          fontSize: isMobile ? 22 : 28,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Manage and track all income sources',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _showAddIncomeDialog(context),
                    icon: const Icon(Icons.add_rounded, size: 20),
                    label: Text(
                      'Add Income',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Summary Cards
              SizedBox(
                height: 140,
                child: GridView(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: isMobile ? 1 : 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: isMobile ? 2 : 2.2,
                  ),
                  children: [
                    _buildSummaryCard(
                      icon: Icons.trending_up_rounded,
                      label: 'Total Income',
                      value: 'AED ${currencyFormat.format(totalIncome)}',
                      color: AppColors.success,
                      isLarge: true,
                    ),
                    _buildSummaryCard(
                      icon: Icons.receipt_long_rounded,
                      label: 'Transactions',
                      value: '${_filteredData.length}',
                      color: AppColors.primary,
                      isLarge: true,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Filters Section
              _buildFiltersSection(context, isMobile),
              const SizedBox(height: 32),

              // Data Table Section
              _buildDataTableSection(context, currencyFormat, isMobile),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFiltersSection(BuildContext context, bool isMobile) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight, width: 1),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Filters & Search',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 20),
          // Search
          TextField(
            decoration: InputDecoration(
              hintText: 'Search by description or category...',
              prefixIcon: Icon(Icons.search_rounded, color: AppColors.textTertiary),
              filled: true,
              fillColor: AppColors.background,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.borderLight),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.borderLight),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppColors.primary, width: 2),
              ),
            ),
            onChanged: (value) => setState(() => _searchTerm = value),
          ),
          const SizedBox(height: 16),
          // Date Range
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              SizedBox(
                width: isMobile ? double.infinity : 300,
                child: DatePickerField(
                  label: 'From Date',
                  initialValue: _filterStartDate,
                  onDateChanged: (date) => setState(() => _filterStartDate = date),
                ),
              ),
              SizedBox(
                width: isMobile ? double.infinity : 300,
                child: DatePickerField(
                  label: 'To Date',
                  initialValue: _filterEndDate,
                  onDateChanged: (date) => setState(() => _filterEndDate = date),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Category Filter
          SizedBox(
            width: isMobile ? double.infinity : 300,
            child: DropdownButtonFormField<String>(
              initialValue: _selectedCategory.isEmpty ? null : _selectedCategory,
              decoration: InputDecoration(
                labelText: 'Filter by Category',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.borderLight),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.borderLight),
                ),
              ),
              items: [
                const DropdownMenuItem(value: '', child: Text('All Categories')),
                ..._categories.map((cat) => DropdownMenuItem(value: cat, child: Text(cat))),
              ],
              onChanged: (value) => setState(() => _selectedCategory = value ?? ''),
            ),
          ),
          const SizedBox(height: 16),
          // Clear Filters
          TextButton.icon(
            onPressed: () {
              setState(() {
                _filterStartDate = null;
                _filterEndDate = null;
                _selectedCategory = '';
                _searchTerm = '';
              });
            },
            icon: const Icon(Icons.clear_rounded, size: 18),
            label: Text(
              'Clear All Filters',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDataTableSection(BuildContext context, NumberFormat currencyFormat, bool isMobile) {
    if (_filteredData.isEmpty) {
      return Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderLight, width: 1),
        ),
        padding: const EdgeInsets.all(48),
        child: Center(
          child: Column(
            children: [
              Icon(
                Icons.inbox_rounded,
                size: 64,
                color: AppColors.borderMedium,
              ),
              const SizedBox(height: 16),
              Text(
                'No income records found',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (isMobile) {
      return Column(
        children: _filteredData
            .map((item) => _buildMobileTransactionCard(item, currencyFormat, context))
            .toList(),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columnSpacing: 24,
          headingRowHeight: 56,
          dataRowHeight: 60,
          headingRowColor: MaterialStateColor.resolveWith((states) => AppColors.background),
          columns: [
            DataColumn(
              label: Text(
                'Date',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            DataColumn(
              label: Text(
                'Category',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            DataColumn(
              label: Text(
                'Description',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            DataColumn(
              label: Text(
                'Amount',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.right,
              ),
              numeric: true,
            ),
            DataColumn(
              label: Text(
                'Method',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            DataColumn(
              label: Text(
                'Actions',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ],
          rows: _filteredData
              .map(
                (item) => DataRow(
                  color: MaterialStateColor.resolveWith((states) {
                    if (states.contains(MaterialState.hovered)) {
                      return AppColors.background;
                    }
                    return Colors.transparent;
                  }),
                  cells: [
                    DataCell(
                      Text(
                        DateFormat('dd MMM yyyy').format(item['date']),
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    DataCell(
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          item['category'],
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.success,
                          ),
                        ),
                      ),
                    ),
                    DataCell(
                      Text(
                        item['description'],
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    DataCell(
                      Text(
                        'AED ${currencyFormat.format(item['amount'])}',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.success,
                        ),
                        textAlign: TextAlign.right,
                      ),
                    ),
                    DataCell(
                      Text(
                        item['method'],
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                    DataCell(
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit_rounded, size: 18, color: AppColors.primary),
                            onPressed: () {},
                            tooltip: 'Edit',
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_rounded, size: 18, color: AppColors.error),
                            onPressed: () {},
                            tooltip: 'Delete',
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )
              .toList(),
        ),
      ),
    );
  }

  Widget _buildMobileTransactionCard(
    Map<String, dynamic> item,
    NumberFormat currencyFormat,
    BuildContext context,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight, width: 1),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormat('dd MMM yyyy').format(item['date']),
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textTertiary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  item['category'],
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.success,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            item['description'],
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'AED ${currencyFormat.format(item['amount'])}',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.success,
                ),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit_rounded, size: 18, color: AppColors.primary),
                    onPressed: () {},
                    tooltip: 'Edit',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_rounded, size: 18, color: AppColors.error),
                    onPressed: () {},
                    tooltip: 'Delete',
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
    required bool isLarge,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
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
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
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
                      fontSize: isLarge ? 20 : 18,
                      fontWeight: FontWeight.w700,
                      color: color,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showAddIncomeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Container(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Add Income',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Form will be integrated soon',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text(
                      'Close',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
