import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../widgets/common/app_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class ReportsPageFinal extends StatefulWidget {
  const ReportsPageFinal({super.key});

  @override
  State<ReportsPageFinal> createState() => _ReportsPageFinalState();
}

class _ReportsPageFinalState extends State<ReportsPageFinal> {
  String _selectedReport = 'monthly';
  int _selectedMonth = DateTime.now().month;
  int _selectedYear = DateTime.now().year;
  DateTime? _customStart;
  DateTime? _customEnd;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    return AppLayoutPro(
      title: 'Reports',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Financial Reports', style: GoogleFonts.inter(fontSize: isMobile ? 22 : 28, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text('View comprehensive financial analysis and reports', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
              const SizedBox(height: 24),

              // Report Type Selection
              Container(
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Select Report Type', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        _buildReportButton('monthly', '📅 Monthly Report', 'View income & expense by month'),
                        _buildReportButton('yearly', '📊 Yearly Report', 'Annual financial overview'),
                        _buildReportButton('custom', '📋 Custom Range', 'Select custom date period'),
                        _buildReportButton('balance', '💼 Balance Sheet', 'Current financial position'),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Report Options
              if (_selectedReport == 'monthly') _buildMonthlyOptions(),
              if (_selectedReport == 'yearly') _buildYearlyOptions(),
              if (_selectedReport == 'custom') _buildCustomOptions(),
              if (_selectedReport == 'balance') _buildBalanceSheetOptions(),

              const SizedBox(height: 24),

              // Report Content
              _buildReportContent(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReportButton(String value, String title, String subtitle) {
    final isSelected = _selectedReport == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedReport = value),
      child: Container(
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : AppColors.background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.primary : AppColors.borderLight, width: isSelected ? 2 : 1),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: isSelected ? AppColors.primary : AppColors.textPrimary)),
            const SizedBox(height: 4),
            Text(subtitle, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthlyOptions() {
    final months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(child: DropdownButtonFormField<int>(initialValue: _selectedMonth, decoration: InputDecoration(labelText: 'Select Month'), items: List.generate(12, (i) => DropdownMenuItem(value: i + 1, child: Text(months[i]))), onChanged: (v) => setState(() => _selectedMonth = v ?? 1))),
          const SizedBox(width: 16),
          Expanded(child: DropdownButtonFormField<int>(initialValue: _selectedYear, decoration: InputDecoration(labelText: 'Select Year'), items: List.generate(5, (i) {final y = DateTime.now().year - i; return DropdownMenuItem(value: y, child: Text(y.toString()));}), onChanged: (v) => setState(() => _selectedYear = v ?? DateTime.now().year))),
        ],
      ),
    );
  }

  Widget _buildYearlyOptions() {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(20),
      child: DropdownButtonFormField<int>(initialValue: _selectedYear, decoration: InputDecoration(labelText: 'Select Year'), items: List.generate(5, (i) {final y = DateTime.now().year - i; return DropdownMenuItem(value: y, child: Text(y.toString()));}), onChanged: (v) => setState(() => _selectedYear = v ?? DateTime.now().year)),
    );
  }

  Widget _buildCustomOptions() {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(child: DatePickerField(label: 'From Date', initialValue: _customStart, onDateChanged: (d) => setState(() => _customStart = d))),
          const SizedBox(width: 16),
          Expanded(child: DatePickerField(label: 'To Date', initialValue: _customEnd, onDateChanged: (d) => setState(() => _customEnd = d))),
        ],
      ),
    );
  }

  Widget _buildBalanceSheetOptions() {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(20),
      child: Text('Balance Sheet as of ${DateFormat('yyyy-MM-dd').format(DateTime.now())}', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
    );
  }

  Widget _buildReportContent() {
    if (_selectedReport == 'monthly') {
      return _buildMonthlyReport();
    } else if (_selectedReport == 'yearly') {
      return _buildYearlyReport();
    } else if (_selectedReport == 'custom') {
      return _customStart == null || _customEnd == null ? _buildEmptyState() : _buildCustomReport();
    } else if (_selectedReport == 'balance') {
      return _buildBalanceSheet();
    }
    return const SizedBox.shrink();
  }

  Widget _buildMonthlyReport() {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final income = 125000.0;
    final expense = 45000.0;
    final balance = income - expense;

    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _buildReportMetric('Total Income', 'AED ${currencyFormat.format(income)}', AppColors.success, Icons.trending_up_rounded),
              const SizedBox(width: 16),
              _buildReportMetric('Total Expense', 'AED ${currencyFormat.format(expense)}', AppColors.error, Icons.trending_down_rounded),
              const SizedBox(width: 16),
              _buildReportMetric('Net Balance', 'AED ${currencyFormat.format(balance)}', AppColors.primary, Icons.balance_rounded),
            ],
          ),
          const SizedBox(height: 24),
          Text('Income Breakdown', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          _buildBreakdownTable([
            {'category': 'Student Fees', 'amount': 100000.0},
            {'category': 'Donations', 'amount': 15000.0},
            {'category': 'Sponsorship', 'amount': 10000.0},
          ], currencyFormat),
          const SizedBox(height: 24),
          ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.download_rounded), label: Text('Export PDF', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600))),
        ],
      ),
    );
  }

  Widget _buildYearlyReport() {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Annual Summary - $_selectedYear', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 20),
          Row(
            children: [
              _buildReportMetric('Annual Income', 'AED 1,500,000', AppColors.success, Icons.trending_up_rounded),
              const SizedBox(width: 16),
              _buildReportMetric('Annual Expense', 'AED 540,000', AppColors.error, Icons.trending_down_rounded),
              const SizedBox(width: 16),
              _buildReportMetric('Annual Balance', 'AED 960,000', AppColors.primary, Icons.balance_rounded),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCustomReport() {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Custom Report', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text('${DateFormat('MMM dd, yyyy').format(_customStart!)} to ${DateFormat('MMM dd, yyyy').format(_customEnd!)}', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
          const SizedBox(height: 20),
          Row(
            children: [
              _buildReportMetric('Total Income', 'AED 250,000', AppColors.success, Icons.trending_up_rounded),
              const SizedBox(width: 16),
              _buildReportMetric('Total Expense', 'AED 85,000', AppColors.error, Icons.trending_down_rounded),
              const SizedBox(width: 16),
              _buildReportMetric('Net Balance', 'AED 165,000', AppColors.primary, Icons.balance_rounded),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBalanceSheet() {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Balance Sheet', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 24),
          Text('ASSETS', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          _buildBalanceRow('Cash', 'AED 15,000'),
          _buildBalanceRow('Bank Balance', 'AED 85,500'),
          const SizedBox(height: 12),
          _buildBoldBalanceRow('Total Assets', 'AED 100,500'),
          const SizedBox(height: 24),
          Divider(color: AppColors.borderLight),
          const SizedBox(height: 24),
          Text('LIABILITIES', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          _buildBalanceRow('Pending Payments', 'AED 5,000'),
          const SizedBox(height: 12),
          _buildBoldBalanceRow('Total Liabilities', 'AED 5,000'),
          const SizedBox(height: 24),
          Divider(color: AppColors.borderLight),
          const SizedBox(height: 24),
          _buildBoldBalanceRow('Current Balance', 'AED 95,500', color: AppColors.success),
        ],
      ),
    );
  }

  Widget _buildReportMetric(String title, String value, Color color, IconData icon) {
    return Expanded(
      child: Container(
        decoration: BoxDecoration(color: color.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(12), border: Border.all(color: color.withValues(alpha: 0.2))),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
                Icon(icon, color: color, size: 20),
              ],
            ),
            const SizedBox(height: 8),
            Text(value, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: color)),
          ],
        ),
      ),
    );
  }

  Widget _buildBreakdownTable(List<Map<String, dynamic>> data, NumberFormat currencyFormat) {
    return Container(
      decoration: BoxDecoration(border: Border.all(color: AppColors.borderLight), borderRadius: BorderRadius.circular(8)),
      child: Column(
        children: List.generate(data.length, (i) {
          final isLast = i == data.length - 1;
          return Container(
            decoration: BoxDecoration(border: Border(bottom: isLast ? BorderSide.none : BorderSide(color: AppColors.borderLight))),
            padding: const EdgeInsets.all(12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(data[i]['category'] as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500)),
                Text('AED ${currencyFormat.format(data[i]['amount'])}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.success)),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildBalanceRow(String label, String amount) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w400)),
          Text(amount, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildBoldBalanceRow(String label, String amount, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700)),
          Text(amount, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: color)),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(48),
        child: Column(
          children: [
            Icon(Icons.date_range_rounded, size: 64, color: AppColors.borderMedium),
            const SizedBox(height: 16),
            Text('Select both dates to view report', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
