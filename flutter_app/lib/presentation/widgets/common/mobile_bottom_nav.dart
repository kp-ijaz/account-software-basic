import 'package:flutter/material.dart';
import '../../theme/modern_theme.dart';

class MobileBottomNavLayout extends StatefulWidget {
  final int initialIndex;
  final List<BottomNavItem> items;
  final Function(int index) onTabChanged;
  final List<Widget> screens;

  const MobileBottomNavLayout({
    required this.initialIndex,
    required this.items,
    required this.onTabChanged,
    required this.screens,
    super.key,
  });

  @override
  State<MobileBottomNavLayout> createState() => _MobileBottomNavLayoutState();
}

class _MobileBottomNavLayoutState extends State<MobileBottomNavLayout> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 12,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
            widget.onTabChanged(index);
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: ModernColors.cardBg,
          selectedItemColor: ModernColors.primary,
          unselectedItemColor: ModernColors.textTertiary,
          elevation: 8,
          items: widget.items
              .map((item) => BottomNavigationBarItem(
                    icon: Icon(item.icon),
                    label: item.label,
                  ))
              .toList(),
        ),
      ),
    );
  }
}

class BottomNavItem {
  final IconData icon;
  final String label;

  BottomNavItem({
    required this.icon,
    required this.label,
  });
}
