import 'package:json_annotation/json_annotation.dart';

part 'auditlog_model.g.dart';

@JsonSerializable()
class AuditLogModel {
  final String id;
  final DateTime createdAt;
  final String actionType;
  final String description;
  final String? transactionId;
  final String oldValues;
  final String newValues;

  AuditLogModel({
    required this.id,
    required this.createdAt,
    required this.actionType,
    required this.description,
    this.transactionId,
    required this.oldValues,
    required this.newValues,
  });

  factory AuditLogModel.fromJson(Map<String, dynamic> json) =>
      _$AuditLogModelFromJson(json);

  Map<String, dynamic> toJson() => _$AuditLogModelToJson(this);
}

@JsonSerializable()
class AuditLogPaginatedModel {
  final List<AuditLogModel> items;
  final int totalCount;
  final int pageNumber;
  final int pageSize;
  final int totalPages;
  final bool hasNextPage;
  final bool hasPreviousPage;

  AuditLogPaginatedModel({
    required this.items,
    required this.totalCount,
    required this.pageNumber,
    required this.pageSize,
    required this.totalPages,
    required this.hasNextPage,
    required this.hasPreviousPage,
  });

  factory AuditLogPaginatedModel.fromJson(Map<String, dynamic> json) =>
      _$AuditLogPaginatedModelFromJson(json);

  Map<String, dynamic> toJson() => _$AuditLogPaginatedModelToJson(this);
}
