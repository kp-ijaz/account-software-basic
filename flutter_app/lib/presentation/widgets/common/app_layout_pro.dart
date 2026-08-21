import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_theme.dart';

class AppLayoutPro extends StatefulWidget {
  final String title;
  final Widget child;
  final bool showBackButton;
  final VoidCallback? onBackPressed;

  const AppLayoutPro({
    required this.title,
    required this.child,
    this.showBackButton = false,
    this.onBackPressed,
    Key? key,
  }) : super(key: key);

  @override
  State<AppLayoutPro> createState() => _AppLayoutProState();
}

class _AppLayoutProState extends State<AppLayoutPro> {
  int _selectedIndex = 0;
  bool _isMobile = false;
  bool _isTablet = false;

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: Icons.dashboard_rounded,
      label: 'Dashboard',
      route: '/dashboard',
    ),
    NavigationItem(
      icon: Icons.trending_up_rounded,
      label: 'Income',
      route: '/income',
    ),
    NavigationItem(
      icon: Icons.trending_down_rounded,
      label: 'Expense',
      route: '/expense',
    ),
    NavigationItem(
      icon: Icons.receipt_rounded,
      label: 'Day Book',
      route: '/daybook',
    ),
    NavigationItem(
      icon: Icons.book_rounded,
      label: 'Ledger',
      route: '/ledger',
    ),
    NavigationItem(
      icon: Icons.bar_chart_rounded,
      label: 'Reports',
      route: '/reports',
    ),
    NavigationItem(
      icon: Icons.settings_rounded,
      label: 'Settings',
      route: '/settings',
    ),
    NavigationItem(
      icon: Icons.history_rounded,
      label: 'Audit Log',
      route: '/audit-log',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    _isMobile = size.width < 768;
    _isTablet = size.width >= 768 && size.width < 1024;

    if (_isMobile) {
      return _buildMobileLayout();
    } else if (_isTablet) {
      return _buildTabletLayout();
    } else {
      return _buildDesktopLayout();
    }
  }

  Widget _buildMobileLayout() {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.title,
          style: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        backgroundColor: AppColors.surface,
        elevation: 1,
        shadowColor: Colors.black.withValues(alpha: 0.05),
      ),
      body: Container(
        color: AppColors.background,
        child: widget.child,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border(
            top: BorderSide(color: AppColors.borderLight, width: 1),
          ),
        ),
        child: BottomNavigationBar(
          backgroundColor: AppColors.surface,
          elevation: 0,
          type: BottomNavigationBarType.shifting,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textTertiary,
          items: _navigationItems
              .map((item) => BottomNavigationBarItem(
                    icon: Icon(item.icon),
                    label: item.label,
              ))
              .toList(),
          onTap: (index) {
            Navigator.pushNamed(context, _navigationItems[index].route);
          },
        ),
      ),
    );
  }

  Widget _buildTabletLayout() {
    return Scaffold(
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 280,
            decoration: BoxDecoration(
              color: AppColors.surface,
              border: Border(
                right: BorderSide(color: AppColors.borderLight, width: 1),
              ),
            ),
            child: Column(
              children: [
                // Logo/Header
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primary, Color(0xFF7C5CFF)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Center(
                          child: Icon(Icons.calculate_rounded, color: Colors.white, size: 22),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Madrasa',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        'Accounting',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: _navigationItems.length,
                    itemBuilder: (context, index) {
                      final item = _navigationItems[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        child: _buildNavItem(item, context),
                      );
                    },
                  ),
                ),
                // Logout
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.logout_rounded, size: 18),
                      label: Text(
                        'Logout',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Main content
          Expanded(
            child: Column(
              children: [
                // Top bar
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    border: Border(
                      bottom: BorderSide(color: AppColors.borderLight, width: 1),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.title,
                        style: GoogleFonts.inter(
                          fontSize: 22,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Icon(Icons.account_circle_rounded, size: 32, color: AppColors.textSecondary),
                    ],
                  ),
                ),
                // Content
                Expanded(
                  child: Container(
                    color: AppColors.background,
                    child: widget.child,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopLayout() {
    return Scaffold(
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 280,
            decoration: BoxDecoration(
              color: AppColors.surface,
              border: Border(
                right: BorderSide(color: AppColors.borderLight, width: 1),
              ),
            ),
            child: Column(
              children: [
                // Logo/Header
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primary, Color(0xFF7C5CFF)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Center(
                          child: Icon(Icons.calculate_rounded, color: Colors.white, size: 24),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Madrasa',
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        'Accounting',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1, color: AppColors.borderLight),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    itemCount: _navigationItems.length,
                    itemBuilder: (context, index) {
                      final item = _navigationItems[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        child: _buildNavItem(item, context),
                      );
                    },
                  ),
                ),
                const Divider(height: 1, color: AppColors.borderLight),
                // Logout
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.logout_rounded, size: 18),
                      label: Text(
                        'Logout',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Main content
          Expanded(
            child: Column(
              children: [
                // Top bar
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    border: Border(
                      bottom: BorderSide(color: AppColors.borderLight, width: 1),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.title,
                        style: GoogleFonts.inter(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderLight, width: 1),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        child: Row(
                          children: [
                            Icon(Icons.account_circle_rounded, size: 32, color: AppColors.primary),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Administrator',
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                                Text(
                                  'admin@madrasa.local',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w400,
                                    color: AppColors.textTertiary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                // Content
                Expanded(
                  child: Container(
                    color: AppColors.background,
                    child: widget.child,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(NavigationItem item, BuildContext context) {
    final isActive = widget.title.contains(item.label);
    return Container(
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
        borderRadius: BorderRadius.circular(10),
      ),
      child: ListTile(
        leading: Icon(
          item.icon,
          color: isActive ? AppColors.primary : AppColors.textSecondary,
          size: 20,
        ),
        title: Text(
          item.label,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
            color: isActive ? AppColors.primary : AppColors.textSecondary,
          ),
        ),
        onTap: () => Navigator.pushNamed(context, item.route),
        hoverColor: AppColors.background,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final String label;
  final String route;

  NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
  });
}
