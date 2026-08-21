import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../widgets/common/app_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class ExpensePageFinal extends StatefulWidget {
  const ExpensePageFinal({super.key});

  @override
  State<ExpensePageFinal> createState() => _ExpensePageFinalState();
}

class _ExpensePageFinalState extends State<ExpensePageFinal> {
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _selectedCategory = '';
  String _searchTerm = '';

  final List<Map<String, dynamic>> _expenseData = [
    {'date': DateTime(2026, 8, 20), 'category': 'Teacher Salary', 'description': 'Monthly salary', 'amount': 2500.00, 'method': 'Bank'},
    {'date': DateTime(2026, 8, 19), 'category': 'Electricity', 'description': 'Electricity bill', 'amount': 500.00, 'method': 'Bank'},
    {'date': DateTime(2026, 8, 18), 'category': 'Maintenance', 'description': 'Building maintenance', 'amount': 800.00, 'method': 'Cash'},
  ];

  final List<String> _categories = ['Teacher Salary', 'Electricity', 'Water', 'Food', 'Maintenance', 'Stationery', 'Events', 'Building Maintenance', 'Miscellaneous'];

  List<Map<String, dynamic>> get _filteredData {
    return _expenseData.where((item) {
      final date = item['date'] as DateTime;
      final matchesDateRange = (_filterStartDate == null || date.isAfter(_filterStartDate!.subtract(const Duration(days: 1)))) &&
          (_filterEndDate == null || date.isBefore(_filterEndDate!.add(const Duration(days: 1))));
      final matchesCategory = _selectedCategory.isEmpty || item['category'] == _selectedCategory;
      final matchesSearch = _searchTerm.isEmpty ||
          (item['description'] as String).toLowerCase().contains(_searchTerm.toLowerCase());
      return matchesDateRange && matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final totalExpense = _filteredData.fold<double>(0, (sum, item) => sum + (item['amount'] as double));

    return AppLayoutPro(
      title: 'Expenses',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Expense Management', style: GoogleFonts.inter(fontSize: isMobile ? 22 : 28, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      const SizedBox(height: 8),
                      Text('Track and manage all expense transactions', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _showAddDialog(),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                    icon: const Icon(Icons.add_rounded),
                    label: Text('Add Expense', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Container(
                decoration: BoxDecoration(color: AppColors.error.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.error.withValues(alpha: 0.2))),
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Total Expenses', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
                        const SizedBox(height: 8),
                        Text('AED ${currencyFormat.format(totalExpense)}', style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.error)),
                      ],
                    ),
                    Icon(Icons.trending_down_rounded, size: 48, color: AppColors.error.withValues(alpha: 0.3)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              _buildFiltersCard(isMobile),
              const SizedBox(height: 24),
              _buildDataTable(isMobile, currencyFormat),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFiltersCard(bool isMobile) {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Filters & Search', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: 16),
          TextField(decoration: InputDecoration(hintText: 'Search expenses...', prefixIcon: Icon(Icons.search_rounded, color: AppColors.textTertiary)), onChanged: (v) => setState(() => _searchTerm = v)),
          const SizedBox(height: 12),
          Wrap(spacing: 12, runSpacing: 12, children: [
            SizedBox(width: isMobile ? double.infinity : 200, child: DatePickerField(label: 'From Date', initialValue: _filterStartDate, onDateChanged: (d) => setState(() => _filterStartDate = d))),
            SizedBox(width: isMobile ? double.infinity : 200, child: DatePickerField(label: 'To Date', initialValue: _filterEndDate, onDateChanged: (d) => setState(() => _filterEndDate = d))),
          ]),
          const SizedBox(height: 12),
          SizedBox(width: isMobile ? double.infinity : 300, child: DropdownButtonFormField<String>(initialValue: _selectedCategory.isEmpty ? null : _selectedCategory, decoration: InputDecoration(labelText: 'Category'), items: [const DropdownMenuItem(value: '', child: Text('All Categories')), ..._categories.map((c) => DropdownMenuItem(value: c, child: Text(c)))], onChanged: (v) => setState(() => _selectedCategory = v ?? ''))),
          const SizedBox(height: 12),
          TextButton.icon(onPressed: () => setState(() {_filterStartDate = null; _filterEndDate = null; _selectedCategory = ''; _searchTerm = '';}), icon: const Icon(Icons.clear_rounded), label: Text('Clear Filters', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600))),
        ],
      ),
    );
  }

  Widget _buildDataTable(bool isMobile, NumberFormat currencyFormat) {
    if (_filteredData.isEmpty) {
      return Center(child: Padding(padding: const EdgeInsets.all(48), child: Column(children: [Icon(Icons.inbox_rounded, size: 64, color: AppColors.borderMedium), const SizedBox(height: 16), Text('No expenses found', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.textSecondary))])));
    }
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columnSpacing: 24,
          columns: [DataColumn(label: Text('Date', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600))), DataColumn(label: Text('Category', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600))), DataColumn(label: Text('Description', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600))), DataColumn(label: Text('Amount', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)), numeric: true), DataColumn(label: Text('Method', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600))), DataColumn(label: Text('Actions', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)))],
          rows: _filteredData.map((item) => DataRow(cells: [DataCell(Text(DateFormat('dd MMM').format(item['date']), style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500))), DataCell(Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: AppColors.error.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)), child: Text(item['category'], style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.error)))), DataCell(Text(item['description'], style: GoogleFonts.inter(fontSize: 13))), DataCell(Text('AED ${currencyFormat.format(item['amount'])}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.error))), DataCell(Text(item['method'], style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500))), DataCell(Row(children: [IconButton(icon: const Icon(Icons.edit_rounded, size: 18, color: AppColors.primary), onPressed: () {}), IconButton(icon: const Icon(Icons.delete_rounded, size: 18, color: AppColors.error), onPressed: () {})]))])).toList(),
        ),
      ),
    );
  }

  void _showAddDialog() {
    showDialog(context: context, builder: (c) => AlertDialog(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), title: Text('Add Expense', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700)), content: Text('Form coming soon...', style: GoogleFonts.inter(fontSize: 14)), actions: [TextButton(onPressed: () => Navigator.pop(c), child: const Text('Close'))]));
  }
}
