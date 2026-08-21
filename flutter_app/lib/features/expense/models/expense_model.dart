import 'package:json_annotation/json_annotation.dart';

part 'expense_model.g.dart';

@JsonSerializable()
class ExpenseModel {
  final String id;
  final String categoryId;
  final String categoryName;
  final double amount;
  final DateTime date;
  final String description;
  final String paymentMethod;
  final DateTime createdAt;
  final DateTime updatedAt;

  ExpenseModel({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.amount,
    required this.date,
    required this.description,
    required this.paymentMethod,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ExpenseModel.fromJson(Map<String, dynamic> json) =>
      _$ExpenseModelFromJson(json);

  Map<String, dynamic> toJson() => _$ExpenseModelToJson(this);
}

@JsonSerializable()
class CreateExpenseRequest {
  final String categoryId;
  final double amount;
  final DateTime date;
  final String description;
  final String paymentMethod;

  CreateExpenseRequest({
    required this.categoryId,
    required this.amount,
    required this.date,
    required this.description,
    required this.paymentMethod,
  });

  factory CreateExpenseRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateExpenseRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateExpenseRequestToJson(this);
}

@JsonSerializable()
class ExpenseListResponse {
  final List<ExpenseModel> items;
  final int totalCount;
  final int pageNumber;
  final int pageSize;
  final int totalPages;
  final bool hasNextPage;
  final bool hasPreviousPage;

  ExpenseListResponse({
    required this.items,
    required this.totalCount,
    required this.pageNumber,
    required this.pageSize,
    required this.totalPages,
    required this.hasNextPage,
    required this.hasPreviousPage,
  });

  factory ExpenseListResponse.fromJson(Map<String, dynamic> json) =>
      _$ExpenseListResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ExpenseListResponseToJson(this);
}
