import 'package:json_annotation/json_annotation.dart';

part 'daybook_model.g.dart';

@JsonSerializable()
class DayBookEntryModel {
  final String transactionId;
  final DateTime date;
  final String description;
  final String category;
  final double income;
  final double expense;
  final double runningBalance;
  final String transactionType; // "Income" or "Expense"
  final String paymentMethod;

  DayBookEntryModel({
    required this.transactionId,
    required this.date,
    required this.description,
    required this.category,
    required this.income,
    required this.expense,
    required this.runningBalance,
    required this.transactionType,
    required this.paymentMethod,
  });

  factory DayBookEntryModel.fromJson(Map<String, dynamic> json) =>
      _$DayBookEntryModelFromJson(json);

  Map<String, dynamic> toJson() => _$DayBookEntryModelToJson(this);
}

@JsonSerializable()
class DayBookPaginatedModel {
  final List<DayBookEntryModel> entries;
  final int totalCount;
  final int pageNumber;
  final int pageSize;
  final int totalPages;
  final bool hasNextPage;
  final bool hasPreviousPage;
  final double totalIncome;
  final double totalExpense;
  final double netBalance;
  final double openingBalance;
  final double closingBalance;

  DayBookPaginatedModel({
    required this.entries,
    required this.totalCount,
    required this.pageNumber,
    required this.pageSize,
    required this.totalPages,
    required this.hasNextPage,
    required this.hasPreviousPage,
    required this.totalIncome,
    required this.totalExpense,
    required this.netBalance,
    required this.openingBalance,
    required this.closingBalance,
  });

  factory DayBookPaginatedModel.fromJson(Map<String, dynamic> json) =>
      _$DayBookPaginatedModelFromJson(json);

  Map<String, dynamic> toJson() => _$DayBookPaginatedModelToJson(this);
}
