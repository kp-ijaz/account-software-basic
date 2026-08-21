import 'package:flutter/material.dart';

class AppColors {
  // Primary colors
  static const Color primary = Color(0xFF4CAF50); // Green
  static const Color primaryLight = Color(0xFF81C784);
  static const Color primaryDark = Color(0xFF388E3C);

  // Background colors
  static const Color background = Color(0xFFFAFAFA);
  static const Color appBarBackground = Color(0xFFFFFFFF);
  static const Color cardBackground = Color(0xFFFFFFFF);
  static const Color inputBackground = Color(0xFFF5F5F5);

  // Text colors
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textLight = Color(0xFF9E9E9E);

  // Status colors
  static const Color success = Color(0xFF4CAF50);
  static const Color error = Color(0xFFE53935);
  static const Color warning = Color(0xFFFBC02D);
  static const Color info = Color(0xFF1976D2);

  // Other colors
  static const Color borderColor = Color(0xFFE0E0E0);
  static const Color dividerColor = Color(0xFFBDBDBD);
  static const Color incomeColor = Color(0xFF4CAF50); // Green
  static const Color expenseColor = Color(0xFFE53935); // Red
  static const Color neutralColor = Color(0xFF9E9E9E); // Grey

  // Opacity variations
  static Color primaryWithOpacity(double opacity) {
    return primary.withOpacity(opacity);
  }

  static Color textPrimaryWithOpacity(double opacity) {
    return textPrimary.withOpacity(opacity);
  }
}
