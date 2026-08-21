import 'package:flutter/material.dart';
import '../../theme/modern_theme.dart';

class ModernLayoutPro extends StatefulWidget {
  final String title;
  final Widget child;
  final VoidCallback? onLogout;
  final Function(String route)? onNavigate;

  const ModernLayoutPro({
    required this.title,
    required this.child,
    this.onLogout,
    this.onNavigate,
    super.key,
  });

  @override
  State<ModernLayoutPro> createState() => _ModernLayoutProState();
}

class _ModernLayoutProState extends State<ModernLayoutPro> {
  int _selectedIndex = 0;

  final List<NavItemPro> _navItems = [
    NavItemPro(
      icon: Icons.dashboard_rounded,
      label: 'Dashboard',
      route: '/dashboard',
      color: const Color(0xFF6366F1),
      bgGradient: LinearGradient(
        colors: [const Color(0xFF6366F1), const Color(0xFF8B5CF6)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.trending_up_rounded,
      label: 'Income',
      route: '/income',
      color: const Color(0xFF10B981),
      bgGradient: LinearGradient(
        colors: [const Color(0xFF10B981), const Color(0xFF059669)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.trending_down_rounded,
      label: 'Expenses',
      route: '/expense',
      color: const Color(0xFFEF4444),
      bgGradient: LinearGradient(
        colors: [const Color(0xFFEF4444), const Color(0xFFDC2626)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.receipt_long_rounded,
      label: 'Day Book',
      route: '/daybook',
      color: const Color(0xFFFBBF24),
      bgGradient: LinearGradient(
        colors: [const Color(0xFFFBBF24), const Color(0xFFF59E0B)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.book_rounded,
      label: 'Ledger',
      route: '/ledger',
      color: const Color(0xFF06B6D4),
      bgGradient: LinearGradient(
        colors: [const Color(0xFF06B6D4), const Color(0xFF0891B2)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.bar_chart_rounded,
      label: 'Reports',
      route: '/reports',
      color: const Color(0xFF8B5CF6),
      bgGradient: LinearGradient(
        colors: [const Color(0xFF8B5CF6), const Color(0xFFD946EF)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.settings_rounded,
      label: 'Settings',
      route: '/settings',
      color: const Color(0xFF64748B),
      bgGradient: LinearGradient(
        colors: [const Color(0xFF64748B), const Color(0xFF475569)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    NavItemPro(
      icon: Icons.history_rounded,
      label: 'Audit Log',
      route: '/audit-log',
      color: const Color(0xFF14B8A6),
      bgGradient: LinearGradient(
        colors: [const Color(0xFF14B8A6), const Color(0xFF0D9488)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
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
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: ModernColors.textPrimary,
            letterSpacing: -0.3,
          ),
        ),
      ),
      body: Container(
        color: ModernColors.darkBg,
        child: widget.child,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: ModernColors.surfaceBg,
          border: Border(
            top: BorderSide(
              color: ModernColors.borderColor.withValues(alpha: 0.2),
              width: 1,
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: SizedBox(
            height: 80,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _navItems
                    .map((item) => _buildMobileNavItem(item))
                    .toList(),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMobileNavItem(NavItemPro item) {
    final isActive = widget.title.contains(item.label);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => widget.onNavigate?.call(item.route),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              gradient: isActive ? item.bgGradient : null,
              color: isActive ? null : ModernColors.cardBg,
              borderRadius: BorderRadius.circular(12),
              border: isActive
                  ? null
                  : Border.all(
                      color: ModernColors.borderColor.withValues(alpha: 0.2),
                      width: 1,
                    ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  item.icon,
                  size: 24,
                  color: isActive ? Colors.white : item.color,
                ),
                const SizedBox(height: 4),
                Text(
                  item.label,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
                    color: isActive ? Colors.white : ModernColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
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
            _buildSidebar(),
            // Main Content
            Expanded(
              child: Column(
                children: [
                  _buildTopBar(),
                  Expanded(
                    child: Container(
                      color: ModernColors.darkBg,
                      child: widget.child,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSidebar() {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        color: ModernColors.surfaceBg,
        border: Border(
          right: BorderSide(
            color: ModernColors.borderColor.withValues(alpha: 0.2),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(4, 0),
          ),
        ],
      ),
      child: Column(
        children: [
          // Logo Section with Gradient
          Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: ModernTheme.primaryGradient,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF6366F1).withValues(alpha: 0.4),
                        blurRadius: 24,
                        offset: const Offset(0, 12),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.calculate_rounded,
                    color: Colors.white,
                    size: 32,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Madrasa',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: ModernColors.textPrimary,
                    letterSpacing: -0.5,
                  ),
                ),
                Text(
                  'Accounting Pro',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: ModernColors.textSecondary,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
          Divider(
            color: ModernColors.borderColor.withValues(alpha: 0.2),
            height: 1,
          ),
          // Navigation Items
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 16),
              itemCount: _navItems.length,
              itemBuilder: (context, index) {
                final item = _navItems[index];
                final isActive = widget.title.contains(item.label);
                return _buildNavItem(item, isActive, context);
              },
            ),
          ),
          Divider(
            color: ModernColors.borderColor.withValues(alpha: 0.2),
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
                  backgroundColor: ModernColors.error.withValues(alpha: 0.1),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: ModernColors.error.withValues(alpha: 0.3),
                      width: 1.5,
                    ),
                  ),
                ),
                icon: const Icon(
                  Icons.logout_rounded,
                  size: 20,
                  color: ModernColors.error,
                ),
                label: Text(
                  'Logout',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFFEF4444),
                    letterSpacing: 0.2,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(NavItemPro item, bool isActive, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => widget.onNavigate?.call(item.route),
          borderRadius: BorderRadius.circular(14),
          hoverColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              gradient: isActive ? item.bgGradient.scale(0.8) : null,
              color: isActive ? null : Colors.transparent,
              borderRadius: BorderRadius.circular(14),
              border: isActive
                  ? Border.all(
                      color: item.color.withValues(alpha: 0.3),
                      width: 1.5,
                    )
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    gradient: item.bgGradient,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: isActive
                        ? [
                            BoxShadow(
                              color: item.color.withValues(alpha: 0.4),
                              blurRadius: 12,
                              offset: const Offset(0, 6),
                            ),
                          ]
                        : [],
                  ),
                  child: Icon(
                    item.icon,
                    size: 22,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    item.label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
                      color: isActive ? Colors.white : ModernColors.textSecondary,
                      letterSpacing: isActive ? 0.2 : 0,
                    ),
                  ),
                ),
                if (isActive)
                  Container(
                    width: 5,
                    height: 28,
                    decoration: BoxDecoration(
                      gradient: item.bgGradient,
                      borderRadius: BorderRadius.circular(3),
                      boxShadow: [
                        BoxShadow(
                          color: item.color.withValues(alpha: 0.5),
                          blurRadius: 8,
                          offset: const Offset(0, 0),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
      decoration: BoxDecoration(
        color: ModernColors.surfaceBg,
        border: Border(
          bottom: BorderSide(
            color: ModernColors.borderColor.withValues(alpha: 0.2),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            widget.title,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: ModernColors.textPrimary,
              letterSpacing: -0.5,
            ),
          ),
          _buildUserProfile(),
        ],
      ),
    );
  }

  Widget _buildUserProfile() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: ModernColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: ModernColors.borderColor.withValues(alpha: 0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              gradient: ModernTheme.primaryGradient,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(
              Icons.person_rounded,
              color: Colors.white,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Admin',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: ModernColors.textPrimary,
                ),
              ),
              Text(
                'Administrator',
                style: TextStyle(
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

class NavItemPro {
  final IconData icon;
  final String label;
  final String route;
  final Color color;
  final LinearGradient bgGradient;

  NavItemPro({
    required this.icon,
    required this.label,
    required this.route,
    required this.color,
    required this.bgGradient,
  });
}
