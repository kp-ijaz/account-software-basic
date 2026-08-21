part of 'settings_bloc.dart';

abstract class SettingsEvent extends Equatable {
  const SettingsEvent();

  @override
  List<Object?> get props => [];
}

class GetSettingsEvent extends SettingsEvent {
  const GetSettingsEvent();
}

class UpdateSettingsEvent extends SettingsEvent {
  final String madrasaName;
  final String address;
  final String phone;
  final String currency;
  final DateTime? financialYearStart;

  const UpdateSettingsEvent({
    required this.madrasaName,
    required this.address,
    required this.phone,
    required this.currency,
    this.financialYearStart,
  });

  @override
  List<Object?> get props =>
      [madrasaName, address, phone, currency, financialYearStart];
}

class UploadLogoEvent extends SettingsEvent {
  final String filePath;

  const UploadLogoEvent({required this.filePath});

  @override
  List<Object?> get props => [filePath];
}

class RefreshSettingsEvent extends SettingsEvent {
  const RefreshSettingsEvent();
}
