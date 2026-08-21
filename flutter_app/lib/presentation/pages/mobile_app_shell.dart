import 'package:flutter/material.dart';
import '../widgets/common/mobile_bottom_nav.dart';
import 'dashboard_mobile.dart';
import 'income_expense_combined_mobile.dart';
import 'ledger_daybook_combined_mobile.dart';
import 'reports_mobile.dart';

class MobileAppShell extends StatefulWidget {
  const MobileAppShell({super.key});

  @override
  State<MobileAppShell> createState() => _MobileAppShellState();
}

class _MobileAppShellState extends State<MobileAppShell> {
  int _selectedIndex = 0;

  final List<BottomNavItem> _navItems = [
    BottomNavItem(icon: Icons.dashboard_rounded, label: 'Dashboard'),
    BottomNavItem(icon: Icons.money_rounded, label: 'Income & Expense'),
    BottomNavItem(icon: Icons.receipt_long_rounded, label: 'Ledger & Book'),
    BottomNavItem(icon: Icons.assessment_rounded, label: 'Reports'),
  ];

  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      const DashboardMobile(),
      const IncomeExpenseCombinedMobile(),
      const LedgerDayBookCombinedMobile(),
      const ReportsMobile(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return MobileBottomNavLayout(
      initialIndex: _selectedIndex,
      items: _navItems,
      screens: _screens,
      onTabChanged: (index) {
        setState(() {
          _selectedIndex = index;
        });
      },
    );
  }
}
