import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:madrasa_accounting/config/network/api_interceptors.dart';
import 'package:madrasa_accounting/core/utils/logger.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  // Repository will be injected in Phase 4+
  // For now, we'll use a stub

  AuthBloc() : super(const AuthInitial()) {
    on<AuthLoginEvent>(_onLogin);
    on<AuthLogoutEvent>(_onLogout);
    on<AuthChangePasswordEvent>(_onChangePassword);
    on<AuthCheckTokenEvent>(_onCheckToken);
    on<AuthInitialEvent>(_onInit);
  }

  Future<void> _onInit(AuthInitialEvent event, Emitter<AuthState> emit) async {
    // Check if token exists in secure storage
    try {
      // TODO: Implement token check from secure storage
      emit(const AuthLoggedOut());
    } catch (e) {
      AppLogger.error('Error checking auth state', error: e);
      emit(const AuthLoggedOut());
    }
  }

  Future<void> _onLogin(AuthLoginEvent event, Emitter<AuthState> emit) async {
    try {
      emit(const AuthLoading());

      // TODO: Call authentication repository
      // For now, emit a placeholder
      AppLogger.info('Login attempt for: ${event.usernameOrEmail}');

      // This will be implemented in Phase 4
      emit(const AuthFailure(message: 'Authentication not yet implemented'));
    } catch (e) {
      AppLogger.error('Login error', error: e);
      emit(AuthFailure(message: 'Login failed. Please try again.'));
    }
  }

  Future<void> _onLogout(AuthLogoutEvent event, Emitter<AuthState> emit) async {
    try {
      emit(const AuthLoading());

      // Remove token from secure storage
      await AuthInterceptor.removeToken();

      emit(const AuthLoggedOut());
      AppLogger.info('User logged out');
    } catch (e) {
      AppLogger.error('Logout error', error: e);
      emit(AuthFailure(message: 'Logout failed. Please try again.'));
    }
  }

  Future<void> _onChangePassword(
      AuthChangePasswordEvent event, Emitter<AuthState> emit) async {
    try {
      emit(const AuthLoading());

      // TODO: Call authentication repository
      AppLogger.info('Password change initiated');

      emit(const PasswordChangeFailure(
          message: 'Password change not yet implemented'));
    } catch (e) {
      AppLogger.error('Password change error', error: e);
      emit(PasswordChangeFailure(message: 'Password change failed'));
    }
  }

  Future<void> _onCheckToken(
      AuthCheckTokenEvent event, Emitter<AuthState> emit) async {
    try {
      // TODO: Verify token with backend
      emit(const AuthLoggedOut());
    } catch (e) {
      AppLogger.error('Token check error', error: e);
      emit(const AuthLoggedOut());
    }
  }
}
