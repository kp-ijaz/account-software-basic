import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:madrasa_accounting/config/environment/environment.dart';
import 'package:madrasa_accounting/config/routes/app_router.dart';
import 'package:madrasa_accounting/config/network/dio_client.dart';
import 'package:madrasa_accounting/core/di/service_locator.dart';
import 'package:madrasa_accounting/core/theme/app_theme.dart';
import 'package:madrasa_accounting/core/utils/logger.dart';
import 'package:madrasa_accounting/presentation/theme/app_theme.dart' as pro_theme;
import 'package:madrasa_accounting/presentation/theme/modern_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize environment
  await Environment.initialize();

  // Initialize logger
  AppLogger.initialize();

  // Setup service locator (dependency injection)
  setupServiceLocator();

  // Initialize Dio client
  setupDioClient();

  runApp(const MadrasaAccountingApp());
}

class MadrasaAccountingApp extends StatelessWidget {
  const MadrasaAccountingApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Madrasa Accounting',
      theme: ModernTheme.lightTheme,
      themeMode: ThemeMode.light,
      routerConfig: AppRouter.router,
      debugShowCheckedModeBanner: false,
      locale: const Locale('en', 'US'),
    );
  }
}
