import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/design_system.dart';
import '../../../core/theme/app_colors.dart';

class AppLayout extends StatefulWidget {
  final Widget child;
  final String? title;

  const AppLayout({
    required this.child,
    this.title,
    Key? key,
  }) : super(key: key);

  @override
  State<AppLayout> createState() => _AppLayoutState();
}

class _AppLayoutState extends State<AppLayout> {
  int _selectedIndex = 0;

  final List<NavigationItem> _navItems = [
    NavigationItem(label: 'Dashboard', icon: Icons.dashboard, route: '/dashboard'),
    NavigationItem(label: 'Income', icon: Icons.add_circle, route: '/income'),
    NavigationItem(label: 'Expense', icon: Icons.remove_circle, route: '/expense'),
    NavigationItem(label: 'Day Book', icon: Icons.receipt_long, route: '/daybook'),
    NavigationItem(label: 'Ledger', icon: Icons.menu_book, route: '/ledger'),
    NavigationItem(label: 'Reports', icon: Icons.assessment, route: '/reports'),
    NavigationItem(label: 'Settings', icon: Icons.settings, route: '/settings'),
    NavigationItem(label: 'Audit Log', icon: Icons.history, route: '/audit-log'),
  ];

  void _navigateTo(int index) {
    setState(() => _selectedIndex = index);
    context.go(_navItems[index].route);
    if (ScreenLayout.isMobile(context)) {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = ScreenLayout.isMobile(context);
    final isTablet = ScreenLayout.isTablet(context);

    if (isMobile) {
      return _MobileLayout(
        title: widget.title,
        navItems: _navItems,
        selectedIndex: _selectedIndex,
        onNavigate: _navigateTo,
        child: widget.child,
      );
    }

    return Scaffold(
      body: Row(
        children: [
          if (!isMobile)
            NavigationRail(
              selectedIndex: _selectedIndex,
              onDestinationSelected: _navigateTo,
              labelType: isTablet ? NavigationRailLabelType.none : NavigationRailLabelType.selected,
              extended: !isTablet,
              destinations: _navItems
                  .map((item) => NavigationRailDestination(
                        icon: Icon(item.icon),
                        selectedIcon: Icon(item.icon),
                        label: Text(item.label),
                      ))
                  .toList(),
              trailing: Expanded(
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: IconButton(
                      icon: const Icon(Icons.logout),
                      tooltip: 'Logout',
                      onPressed: _showLogoutDialog,
                    ),
                  ),
                ),
              ),
            ),
          Expanded(
            child: Column(
              children: [
                _AppBar(title: widget.title),
                Expanded(child: widget.child),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.go('/login');
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}

class _MobileLayout extends StatelessWidget {
  final Widget child;
  final String? title;
  final List<NavigationItem> navItems;
  final int selectedIndex;
  final Function(int) onNavigate;

  const _MobileLayout({
    required this.child,
    required this.title,
    required this.navItems,
    required this.selectedIndex,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title ?? 'Madrasa Accounting'),
        elevation: 0,
      ),
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: selectedIndex,
        onTap: onNavigate,
        type: BottomNavigationBarType.shifting,
        items: navItems
            .map((item) => BottomNavigationBarItem(
                  icon: Icon(item.icon),
                  label: item.label,
                  backgroundColor: AppColors.primary,
                ))
            .toList(),
      ),
    );
  }

}

class _AppBar extends StatelessWidget {
  final String? title;

  const _AppBar({this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.paddingLg,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1,
          ),
        ),
        boxShadow: AppShadows.cardShadows,
      ),
      child: Text(
        title ?? 'Madrasa Accounting',
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
      ),
    );
  }
}

class NavigationItem {
  final String label;
  final IconData icon;
  final String route;

  NavigationItem({
    required this.label,
    required this.icon,
    required this.route,
  });
}
