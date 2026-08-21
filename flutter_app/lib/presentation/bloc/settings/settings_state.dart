part of 'settings_bloc.dart';

abstract class SettingsState extends Equatable {
  const SettingsState();

  @override
  List<Object?> get props => [];
}

class SettingsInitial extends SettingsState {
  const SettingsInitial();
}

class SettingsLoading extends SettingsState {
  const SettingsLoading();
}

class SettingsLoaded extends SettingsState {
  final SettingsModel settings;

  const SettingsLoaded({required this.settings});

  @override
  List<Object?> get props => [settings];
}

class SettingsFailure extends SettingsState {
  final String message;

  const SettingsFailure({required this.message});

  @override
  List<Object?> get props => [message];
}

class SettingsUpdateSuccess extends SettingsState {
  final SettingsModel settings;

  const SettingsUpdateSuccess({required this.settings});

  @override
  List<Object?> get props => [settings];
}

class SettingsUpdateFailure extends SettingsState {
  final String message;

  const SettingsUpdateFailure({required this.message});

  @override
  List<Object?> get props => [message];
}

class LogoUploadSuccess extends SettingsState {
  final String logoPath;

  const LogoUploadSuccess({required this.logoPath});

  @override
  List<Object?> get props => [logoPath];
}

class LogoUploadFailure extends SettingsState {
  final String message;

  const LogoUploadFailure({required this.message});

  @override
  List<Object?> get props => [message];
}
