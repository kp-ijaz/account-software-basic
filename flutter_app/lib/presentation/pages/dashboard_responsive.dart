import 'package:flutter/material.dart';
import 'dashboard_unified.dart';
import 'mobile_app_shell.dart';

class DashboardResponsive extends StatelessWidget {
  const DashboardResponsive({super.key});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;

    return isMobile ? const MobileAppShell() : const DashboardUnified();
  }
}
