part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthLoginEvent extends AuthEvent {
  final String usernameOrEmail;
  final String password;

  const AuthLoginEvent({
    required this.usernameOrEmail,
    required this.password,
  });

  @override
  List<Object?> get props => [usernameOrEmail, password];
}

class AuthLogoutEvent extends AuthEvent {
  const AuthLogoutEvent();
}

class AuthChangePasswordEvent extends AuthEvent {
  final String currentPassword;
  final String newPassword;
  final String confirmPassword;

  const AuthChangePasswordEvent({
    required this.currentPassword,
    required this.newPassword,
    required this.confirmPassword,
  });

  @override
  List<Object?> get props => [currentPassword, newPassword, confirmPassword];
}

class AuthCheckTokenEvent extends AuthEvent {
  const AuthCheckTokenEvent();
}

class AuthInitialEvent extends AuthEvent {
  const AuthInitialEvent();
}
