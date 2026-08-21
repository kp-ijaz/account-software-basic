import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:madrasa_accounting/data/models/settings_models.dart';
import 'package:madrasa_accounting/core/utils/logger.dart';

part 'settings_event.dart';
part 'settings_state.dart';

class SettingsBloc extends Bloc<SettingsEvent, SettingsState> {
  // Repository will be injected in Phase 5+
  // For now, we'll use a stub

  SettingsBloc() : super(const SettingsInitial()) {
    on<GetSettingsEvent>(_onGetSettings);
    on<UpdateSettingsEvent>(_onUpdateSettings);
    on<UploadLogoEvent>(_onUploadLogo);
    on<RefreshSettingsEvent>(_onRefreshSettings);
  }

  Future<void> _onGetSettings(
      GetSettingsEvent event, Emitter<SettingsState> emit) async {
    try {
      emit(const SettingsLoading());

      // TODO: Call settings repository
      AppLogger.info('Fetching settings...');

      // This will be implemented with repository
      emit(const SettingsFailure(message: 'Settings not yet implemented'));
    } catch (e) {
      AppLogger.error('Settings fetch error', error: e);
      emit(SettingsFailure(message: 'Failed to load settings'));
    }
  }

  Future<void> _onUpdateSettings(
      UpdateSettingsEvent event, Emitter<SettingsState> emit) async {
    try {
      emit(const SettingsLoading());

      // TODO: Call settings repository
      AppLogger.info('Updating settings: ${event.madrasaName}');

      emit(const SettingsUpdateFailure(
          message: 'Settings update not yet implemented'));
    } catch (e) {
      AppLogger.error('Settings update error', error: e);
      emit(SettingsUpdateFailure(message: 'Failed to update settings'));
    }
  }

  Future<void> _onUploadLogo(
      UploadLogoEvent event, Emitter<SettingsState> emit) async {
    try {
      emit(const SettingsLoading());

      // TODO: Call settings repository
      AppLogger.info('Uploading logo: ${event.filePath}');

      emit(const LogoUploadFailure(message: 'Logo upload not yet implemented'));
    } catch (e) {
      AppLogger.error('Logo upload error', error: e);
      emit(LogoUploadFailure(message: 'Failed to upload logo'));
    }
  }

  Future<void> _onRefreshSettings(
      RefreshSettingsEvent event, Emitter<SettingsState> emit) async {
    try {
      // TODO: Call settings repository
      emit(const SettingsLoading());
      AppLogger.info('Refreshing settings...');

      emit(const SettingsFailure(message: 'Settings refresh not yet implemented'));
    } catch (e) {
      AppLogger.error('Settings refresh error', error: e);
      emit(SettingsFailure(message: 'Failed to refresh settings'));
    }
  }
}
