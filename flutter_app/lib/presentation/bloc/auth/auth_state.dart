part of 'auth_bloc.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthSuccess extends AuthState {
  final String accessToken;
  final String username;
  final String email;

  const AuthSuccess({
    required this.accessToken,
    required this.username,
    required this.email,
  });

  @override
  List<Object?> get props => [accessToken, username, email];
}

class AuthFailure extends AuthState {
  final String message;

  const AuthFailure({required this.message});

  @override
  List<Object?> get props => [message];
}

class AuthLoggedOut extends AuthState {
  const AuthLoggedOut();
}

class PasswordChangeSuccess extends AuthState {
  const PasswordChangeSuccess();
}

class PasswordChangeFailure extends AuthState {
  final String message;

  const PasswordChangeFailure({required this.message});

  @override
  List<Object?> get props => [message];
}
