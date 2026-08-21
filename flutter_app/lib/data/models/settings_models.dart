class SettingsModel {
  final String id;
  final String madrasaName;
  final String address;
  final String phone;
  final String currency;
  final DateTime? financialYearStart;
  final String? logoPath;
  final DateTime createdAt;
  final DateTime updatedAt;

  SettingsModel({
    required this.id,
    required this.madrasaName,
    required this.address,
    required this.phone,
    required this.currency,
    this.financialYearStart,
    this.logoPath,
    required this.createdAt,
    required this.updatedAt,
  });

  factory SettingsModel.fromJson(Map<String, dynamic> json) {
    return SettingsModel(
      id: json['id'] as String? ?? '',
      madrasaName: json['madrasaName'] as String? ?? '',
      address: json['address'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      currency: json['currency'] as String? ?? 'AED',
      financialYearStart: json['financialYearStart'] != null
          ? DateTime.parse(json['financialYearStart'] as String)
          : null,
      logoPath: json['logoPath'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String? ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] as String? ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'madrasaName': madrasaName,
      'address': address,
      'phone': phone,
      'currency': currency,
      'financialYearStart': financialYearStart?.toIso8601String(),
      'logoPath': logoPath,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class UpdateSettingsRequest {
  final String madrasaName;
  final String address;
  final String phone;
  final String currency;
  final DateTime? financialYearStart;

  UpdateSettingsRequest({
    required this.madrasaName,
    required this.address,
    required this.phone,
    required this.currency,
    this.financialYearStart,
  });

  Map<String, dynamic> toJson() {
    return {
      'madrasaName': madrasaName,
      'address': address,
      'phone': phone,
      'currency': currency,
      'financialYearStart': financialYearStart?.toIso8601String(),
    };
  }
}
