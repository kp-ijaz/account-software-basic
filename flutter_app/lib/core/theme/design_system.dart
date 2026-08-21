import 'package:flutter/material.dart';

class AppSpacing {
  // Spacing scale
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double xxxl = 32;

  // Common combinations
  static const EdgeInsets paddingSm = EdgeInsets.all(sm);
  static const EdgeInsets paddingMd = EdgeInsets.all(md);
  static const EdgeInsets paddingLg = EdgeInsets.all(lg);
  static const EdgeInsets paddingXl = EdgeInsets.all(xl);
  static const EdgeInsets paddingXxl = EdgeInsets.all(xxl);

  static const EdgeInsets horizontalPaddingMd = EdgeInsets.symmetric(horizontal: md);
  static const EdgeInsets horizontalPaddingLg = EdgeInsets.symmetric(horizontal: lg);
  static const EdgeInsets verticalPaddingMd = EdgeInsets.symmetric(vertical: md);
  static const EdgeInsets verticalPaddingLg = EdgeInsets.symmetric(vertical: lg);
}

class AppSizing {
  // Breakpoints
  static const double mobileMaxWidth = 480;
  static const double tabletMinWidth = 481;
  static const double tabletMaxWidth = 1024;
  static const double desktopMinWidth = 1025;

  // Component sizes
  static const double iconSmall = 20;
  static const double iconMedium = 24;
  static const double iconLarge = 32;

  static const double buttonHeightSmall = 36;
  static const double buttonHeightMedium = 44;
  static const double buttonHeightLarge = 52;

  static const double cardBorderRadius = 12;
  static const double buttonBorderRadius = 8;
  static const double inputBorderRadius = 8;

  // Card elevation
  static const double cardElevation = 2;
  static const double cardElevationHover = 4;
}

class ScreenLayout {
  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width <= AppSizing.mobileMaxWidth;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width > AppSizing.tabletMinWidth &&
      MediaQuery.of(context).size.width <= AppSizing.tabletMaxWidth;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width > AppSizing.desktopMinWidth;

  static double getContainerWidth(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (isMobile(context)) return width - (AppSpacing.lg * 2);
    if (isTablet(context)) return width * 0.9;
    return width * 0.85;
  }

  static int getGridColumns(BuildContext context) {
    if (isMobile(context)) return 1;
    if (isTablet(context)) return 2;
    return 3;
  }

  static int getGridColumnsForMetrics(BuildContext context) {
    if (isMobile(context)) return 1;
    if (isTablet(context)) return 2;
    return 3;
  }
}

class AppShadows {
  static const BoxShadow light = BoxShadow(
    color: Color(0x0F000000),
    blurRadius: 2,
    offset: Offset(0, 1),
  );

  static const BoxShadow medium = BoxShadow(
    color: Color(0x14000000),
    blurRadius: 4,
    offset: Offset(0, 2),
  );

  static const BoxShadow large = BoxShadow(
    color: Color(0x1A000000),
    blurRadius: 8,
    offset: Offset(0, 4),
  );

  static List<BoxShadow> get cardShadows => [light, medium];
}
