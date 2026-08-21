import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../presentation/pages/login_page.dart';
import '../../presentation/pages/dashboard_responsive.dart';
import '../../presentation/pages/income_page_v2.dart';
import '../../presentation/pages/expense_page_v2.dart';
import '../../presentation/pages/daybook_page_v2.dart';
import '../../presentation/pages/ledger_page_v2.dart';
import '../../presentation/pages/reports_page_v2.dart';
import '../../presentation/pages/settings_page.dart';
import '../../presentation/pages/audit_log_page.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/login',
    errorBuilder: (context, state) => const ErrorPage(),
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardResponsive(),
      ),
      GoRoute(
        path: '/income',
        name: 'income',
        builder: (context, state) => const IncomePageV2(),
      ),
      GoRoute(
        path: '/expense',
        name: 'expense',
        builder: (context, state) => const ExpensePageV2(),
      ),
      GoRoute(
        path: '/daybook',
        name: 'daybook',
        builder: (context, state) => const DayBookPageV2(),
      ),
      GoRoute(
        path: '/ledger',
        name: 'ledger',
        builder: (context, state) => const LedgerPageV2(),
      ),
      GoRoute(
        path: '/reports',
        name: 'reports',
        builder: (context, state) => const ReportsPageV2(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsPage(),
      ),
      GoRoute(
        path: '/audit-log',
        name: 'audit-log',
        builder: (context, state) => const AuditLogPage(),
      ),
    ],
  );
}

class ErrorPage extends StatelessWidget {
  const ErrorPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Error Page'),
      ),
    );
  }
}
