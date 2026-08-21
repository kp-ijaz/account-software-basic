import 'package:json_annotation/json_annotation.dart';

part 'ledger_model.g.dart';

@JsonSerializable()
class LedgerEntryModel {
  final String transactionId;
  final DateTime date;
  final String description;
  final String category;
  final double debit;
  final double credit;
  final double runningBalance;
  final String transactionType; // "Income" or "Expense"
  final String paymentMethod;

  LedgerEntryModel({
    required this.transactionId,
    required this.date,
    required this.description,
    required this.category,
    required this.debit,
    required this.credit,
    required this.runningBalance,
    required this.transactionType,
    required this.paymentMethod,
  });

  factory LedgerEntryModel.fromJson(Map<String, dynamic> json) =>
      _$LedgerEntryModelFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerEntryModelToJson(this);
}

@JsonSerializable()
class LedgerPaginatedModel {
  final List<LedgerEntryModel> entries;
  final int totalCount;
  final int pageNumber;
  final int pageSize;
  final int totalPages;
  final bool hasNextPage;
  final bool hasPreviousPage;
  final double totalDebit;
  final double totalCredit;
  final double openingBalance;
  final double closingBalance;

  LedgerPaginatedModel({
    required this.entries,
    required this.totalCount,
    required this.pageNumber,
    required this.pageSize,
    required this.totalPages,
    required this.hasNextPage,
    required this.hasPreviousPage,
    required this.totalDebit,
    required this.totalCredit,
    required this.openingBalance,
    required this.closingBalance,
  });

  factory LedgerPaginatedModel.fromJson(Map<String, dynamic> json) =>
      _$LedgerPaginatedModelFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerPaginatedModelToJson(this);
}
