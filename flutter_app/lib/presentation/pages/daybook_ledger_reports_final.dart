import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../widgets/common/app_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

// ========== DAY BOOK PAGE ==========
class DayBookPageFinal extends StatefulWidget {
  const DayBookPageFinal({super.key});

  @override
  State<DayBookPageFinal> createState() => _DayBookPageFinalState();
}

class _DayBookPageFinalState extends State<DayBookPageFinal> {
  DateTime? _startDate;
  DateTime? _endDate;
  String _filterType = 'all';

  final List<Map<String, dynamic>> _transactions = [
    {'date': DateTime(2026, 8, 20), 'description': 'Student Fees', 'income': 5000, 'expense': 0, 'balance': 5000},
    {'date': DateTime(2026, 8, 20), 'description': 'Teacher Salary', 'income': 0, 'expense': 2500, 'balance': 2500},
    {'date': DateTime(2026, 8, 19), 'description': 'Electricity Bill', 'income': 0, 'expense': 500, 'balance': 2000},
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    return AppLayoutPro(
      title: 'Day Book',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Day Book', style: GoogleFonts.inter(fontSize: isMobile ? 22 : 28, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text('Chronological record of all transactions', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(child: _buildSummaryCard('Total Income', 'AED 12,500', AppColors.success, Icons.trending_up_rounded)),
                  const SizedBox(width: 16),
                  Expanded(child: _buildSummaryCard('Total Expense', 'AED 5,500', AppColors.error, Icons.trending_down_rounded)),
                  const SizedBox(width: 16),
                  Expanded(child: _buildSummaryCard('Balance', 'AED 7,000', AppColors.primary, Icons.balance_rounded)),
                ],
              ),
              const SizedBox(height: 24),
              Container(
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Filters', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 16),
                    Row(children: [Expanded(child: DatePickerField(label: 'From Date', initialValue: _startDate, onDateChanged: (d) => setState(() => _startDate = d))), const SizedBox(width: 12), Expanded(child: DatePickerField(label: 'To Date', initialValue: _endDate, onDateChanged: (d) => setState(() => _endDate = d)))]),
                    const SizedBox(height: 12),
                    SegmentedButton<String>(segments: const [ButtonSegment(value: 'all', label: Text('All')), ButtonSegment(value: 'income', label: Text('Income')), ButtonSegment(value: 'expense', label: Text('Expense'))], selected: {_filterType}, onSelectionChanged: (s) => setState(() => _filterType = s.first)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columnSpacing: 24,
                    columns: [DataColumn(label: Text('Date', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600))), DataColumn(label: Text('Description', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600))), DataColumn(label: Text('Income', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)), numeric: true), DataColumn(label: Text('Expense', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)), numeric: true), DataColumn(label: Text('Balance', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)), numeric: true)],
                    rows: _transactions.map((t) => DataRow(cells: [DataCell(Text(DateFormat('dd MMM').format(t['date']), style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500))), DataCell(Text(t['description'], style: GoogleFonts.inter(fontSize: 13))), DataCell(Text(t['income'] > 0 ? 'AED ${t['income']}' : '-', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.success))), DataCell(Text(t['expense'] > 0 ? 'AED ${t['expense']}' : '-', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.error))), DataCell(Text('AED ${t['balance']}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)))])).toList(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String value, Color color, IconData icon) {
    return Container(
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.borderLight)),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary)), Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)), child: Icon(icon, color: color, size: 18))],
          ),
          const SizedBox(height: 8),
          Text(value, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: color)),
        ],
      ),
    );
  }
}

// ========== SETTINGS PAGE ==========
class SettingsPageFinal extends StatefulWidget {
  const SettingsPageFinal({super.key});

  @override
  State<SettingsPageFinal> createState() => _SettingsPageFinalState();
}

class _SettingsPageFinalState extends State<SettingsPageFinal> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    return AppLayoutPro(
      title: 'Settings',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Settings', style: GoogleFonts.inter(fontSize: isMobile ? 22 : 28, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text('Manage your Madrasa information and preferences', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
              const SizedBox(height: 32),
              Container(
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Madrasa Information', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 20),
                    TextFormField(decoration: InputDecoration(labelText: 'Madrasa Name'), initialValue: 'Al-Noor Madrasa'),
                    const SizedBox(height: 16),
                    TextFormField(decoration: InputDecoration(labelText: 'Address'), initialValue: '123 Islamic Street'),
                    const SizedBox(height: 16),
                    TextFormField(decoration: InputDecoration(labelText: 'Phone'), initialValue: '+971 4 123 4567'),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(decoration: InputDecoration(labelText: 'Currency'), value: 'AED', items: [const DropdownMenuItem(value: 'AED', child: Text('AED - UAE Dirham')), const DropdownMenuItem(value: 'SAR', child: Text('SAR - Saudi Riyal'))], onChanged: (v) {}),
                    const SizedBox(height: 24),
                    ElevatedButton(onPressed: () {}, child: Text('Save Changes', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600))),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Account Security', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 20),
                    ListTile(contentPadding: EdgeInsets.zero, title: Text('Change Password', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500)), trailing: Icon(Icons.chevron_right_rounded, color: AppColors.textTertiary), onTap: () {}),
                    Divider(color: AppColors.borderLight),
                    ListTile(contentPadding: EdgeInsets.zero, title: Text('Two-Factor Authentication', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500)), trailing: Switch(value: false, onChanged: (v) {})),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ========== AUDIT LOG PAGE ==========
class AuditLogPageFinal extends StatelessWidget {
  const AuditLogPageFinal({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    final auditLogs = [
      {'action': 'Login', 'description': 'User logged in', 'time': '2 hours ago', 'icon': Icons.login_rounded, 'color': AppColors.success},
      {'action': 'Income Created', 'description': 'Student Fees - AED 5,000', 'time': '2 hours ago', 'icon': Icons.add_rounded, 'color': AppColors.success},
      {'action': 'Expense Created', 'description': 'Teacher Salary - AED 2,500', 'time': '4 hours ago', 'icon': Icons.add_rounded, 'color': AppColors.error},
      {'action': 'Settings Updated', 'description': 'Madrasa information updated', 'time': '1 day ago', 'icon': Icons.settings_rounded, 'color': AppColors.primary},
    ];

    return AppLayoutPro(
      title: 'Audit Log',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(isMobile ? 16 : 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Audit Log', style: GoogleFonts.inter(fontSize: isMobile ? 22 : 28, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text('Track all system activities and changes', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
              const SizedBox(height: 24),
              Container(
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.borderLight)),
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: auditLogs.length,
                  separatorBuilder: (_, __) => Divider(height: 1, color: AppColors.borderLight),
                  itemBuilder: (_, index) {
                    final log = auditLogs[index];
                    return Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: (log['color'] as Color).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)), child: Icon(log['icon'] as IconData, color: log['color'] as Color, size: 20)),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(log['action'] as String, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                                const SizedBox(height: 4),
                                Text(log['description'] as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w400, color: AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          Text(log['time'] as String, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textTertiary)),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
