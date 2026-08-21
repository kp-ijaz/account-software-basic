import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/modern_theme.dart';

class ModernLayout extends StatefulWidget {
  final String title;
  final Widget child;
  final VoidCallback? onLogout;

  const ModernLayout({
    required this.title,
    required this.child,
    this.onLogout,
    super.key,
  });

  @override
  State<ModernLayout> createState() => _ModernLayoutState();
}

class _ModernLayoutState extends State<ModernLayout> {
  int _selectedIndex = 0;

  final List<NavItem> _navItems = [
    NavItem(
      icon: Icons.dashboard_rounded,
      label: 'Dashboard',
      route: '/dashboard',
      color: ModernColors.primary,
    ),
    NavItem(
      icon: Icons.trending_up_rounded,
      label: 'Income',
      route: '/income',
      color: ModernColors.success,
    ),
    NavItem(
      icon: Icons.trending_down_rounded,
      label: 'Expenses',
      route: '/expenses',
      color: ModernColors.error,
    ),
    NavItem(
      icon: Icons.receipt_long_rounded,
      label: 'Day Book',
      route: '/daybook',
      color: const Color(0xFFFBBF24),
    ),
    NavItem(
      icon: Icons.book_rounded,
      label: 'Ledger',
      route: '/ledger',
      color: const Color(0xFF06B6D4),
    ),
    NavItem(
      icon: Icons.bar_chart_rounded,
      label: 'Reports',
      route: '/reports',
      color: ModernColors.secondary,
    ),
    NavItem(
      icon: Icons.settings_rounded,
      label: 'Settings',
      route: '/settings',
      color: const Color(0xFF8B5CF6),
    ),
    NavItem(
      icon: Icons.history_rounded,
      label: 'Audit Log',
      route: '/audit-log',
      color: const Color(0xFF14B8A6),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    if (isMobile) {
      return _buildMobileLayout();
    }
    return _buildDesktopLayout();
  }

  Widget _buildMobileLayout() {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: ModernColors.surfaceBg,
        elevation: 0,
        title: Text(
          widget.title,
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: ModernColors.textPrimary,
          ),
        ),
      ),
      body: Container(
        color: ModernColors.darkBg,
        child: widget.child,
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: ModernColors.surfaceBg,
        selectedItemColor: ModernColors.primary,
        unselectedItemColor: ModernColors.textTertiary,
        type: BottomNavigationBarType.shifting,
        items: _navItems
            .map((item) => BottomNavigationBarItem(
                  icon: Icon(item.icon),
                  label: item.label,
            ))
            .toList(),
        onTap: (index) {
          Navigator.pushNamed(context, _navItems[index].route);
        },
      ),
    );
  }

  Widget _buildDesktopLayout() {
    return Scaffold(
      body: Container(
        color: ModernColors.darkBg,
        child: Row(
          children: [
            // Modern Sidebar
            Container(
              width: 280,
              decoration: BoxDecoration(
                color: ModernColors.surfaceBg,
                border: Border(
                  right: BorderSide(
                    color: ModernColors.borderLight.withOpacity(0.3),
                    width: 1,
                  ),
                ),
              ),
              child: Column(
                children: [
                  // Logo Section
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            gradient: ModernTheme.primaryGradient,
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: [
                              BoxShadow(
                                color: ModernColors.primary.withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.calculate_rounded,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Madrasa',
                          style: GoogleFonts.poppins(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: ModernColors.textPrimary,
                          ),
                        ),
                        Text(
                          'Accounting Pro',
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: ModernColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(
                    color: ModernColors.borderColor,
                    height: 1,
                  ),
                  // Navigation Items
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      itemCount: _navItems.length,
                      itemBuilder: (context, index) {
                        final item = _navItems[index];
                        final isActive = widget.title.contains(item.label);
                        return _buildNavItem(item, isActive, context);
                      },
                    ),
                  ),
                  const Divider(
                    color: ModernColors.borderColor,
                    height: 1,
                  ),
                  // Logout Button
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: widget.onLogout,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: ModernColors.cardBg,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                            side: const BorderSide(
                              color: ModernColors.borderColor,
                              width: 1,
                            ),
                          ),
                        ),
                        icon: const Icon(
                          Icons.logout_rounded,
                          size: 18,
                          color: ModernColors.error,
                        ),
                        label: Text(
                          'Logout',
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: ModernColors.textPrimary,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Main Content
            Expanded(
              child: Container(
                color: ModernColors.darkBg,
                child: Column(
                  children: [
                    // Top Bar
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 20,
                      ),
                      decoration: BoxDecoration(
                        color: ModernColors.surfaceBg,
                        border: Border(
                          bottom: BorderSide(
                            color: ModernColors.borderLight.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            widget.title,
                            style: GoogleFonts.poppins(
                              fontSize: 26,
                              fontWeight: FontWeight.w800,
                              color: ModernColors.textPrimary,
                            ),
                          ),
                          _buildUserProfile(),
                        ],
                      ),
                    ),
                    // Content
                    Expanded(
                      child: Container(
                        color: ModernColors.darkBg,
                        child: widget.child,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(NavItem item, bool isActive, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => Navigator.pushNamed(context, item.route),
          borderRadius: BorderRadius.circular(12),
          hoverColor: ModernColors.cardBg.withOpacity(0.5),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isActive
                  ? item.color.withOpacity(0.1)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              border: isActive
                  ? Border.all(
                      color: item.color.withOpacity(0.3),
                      width: 1.5,
                    )
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: item.color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    item.icon,
                    size: 20,
                    color: item.color,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    item.label,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                      color: isActive
                          ? item.color
                          : ModernColors.textSecondary,
                    ),
                  ),
                ),
                if (isActive)
                  Container(
                    width: 4,
                    height: 24,
                    decoration: BoxDecoration(
                      color: item.color,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUserProfile() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: ModernColors.borderColor.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: ModernTheme.primaryGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.person_rounded, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Administrator',
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: ModernColors.textPrimary,
                ),
              ),
              Text(
                'admin@madrasa.local',
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  fontWeight: FontWeight.w400,
                  color: ModernColors.textTertiary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class NavItem {
  final IconData icon;
  final String label;
  final String route;
  final Color color;

  NavItem({
    required this.icon,
    required this.label,
    required this.route,
    required this.color,
  });
}
