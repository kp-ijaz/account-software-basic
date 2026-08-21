import 'package:json_annotation/json_annotation.dart';

part 'reports_model.g.dart';

// Monthly Report Models

@JsonSerializable()
class CategorySummaryModel {
  final String category;
  final double amount;
  final int transactionCount;
  final double percentage;

  CategorySummaryModel({
    required this.category,
    required this.amount,
    required this.transactionCount,
    required this.percentage,
  });

  factory CategorySummaryModel.fromJson(Map<String, dynamic> json) =>
      _$CategorySummaryModelFromJson(json);

  Map<String, dynamic> toJson() => _$CategorySummaryModelToJson(this);
}

@JsonSerializable()
class DayBookEntryForReportModel {
  final DateTime date;
  final String description;
  final String category;
  final double income;
  final double expense;
  final double balance;

  DayBookEntryForReportModel({
    required this.date,
    required this.description,
    required this.category,
    required this.income,
    required this.expense,
    required this.balance,
  });

  factory DayBookEntryForReportModel.fromJson(Map<String, dynamic> json) =>
      _$DayBookEntryForReportModelFromJson(json);

  Map<String, dynamic> toJson() => _$DayBookEntryForReportModelToJson(this);
}

@JsonSerializable()
class LedgerEntryForReportModel {
  final DateTime date;
  final String description;
  final String category;
  final double debit;
  final double credit;
  final double balance;

  LedgerEntryForReportModel({
    required this.date,
    required this.description,
    required this.category,
    required this.debit,
    required this.credit,
    required this.balance,
  });

  factory LedgerEntryForReportModel.fromJson(Map<String, dynamic> json) =>
      _$LedgerEntryForReportModelFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerEntryForReportModelToJson(this);
}

@JsonSerializable()
class MonthlyReportModel {
  final int month;
  final int year;
  final String monthName;
  final double totalIncome;
  final double totalExpense;
  final double netBalance;
  final List<CategorySummaryModel> incomeByCategory;
  final List<CategorySummaryModel> expenseByCategory;
  final List<DayBookEntryForReportModel> dayBookEntries;
  final List<LedgerEntryForReportModel> ledgerEntries;
  final double openingBalance;
  final double closingBalance;

  MonthlyReportModel({
    required this.month,
    required this.year,
    required this.monthName,
    required this.totalIncome,
    required this.totalExpense,
    required this.netBalance,
    required this.incomeByCategory,
    required this.expenseByCategory,
    required this.dayBookEntries,
    required this.ledgerEntries,
    required this.openingBalance,
    required this.closingBalance,
  });

  factory MonthlyReportModel.fromJson(Map<String, dynamic> json) =>
      _$MonthlyReportModelFromJson(json);

  Map<String, dynamic> toJson() => _$MonthlyReportModelToJson(this);
}

// Yearly Report Models

@JsonSerializable()
class YearlyMonthDataModel {
  final int month;
  final String monthName;
  final double income;
  final double expense;
  final double balance;

  YearlyMonthDataModel({
    required this.month,
    required this.monthName,
    required this.income,
    required this.expense,
    required this.balance,
  });

  factory YearlyMonthDataModel.fromJson(Map<String, dynamic> json) =>
      _$YearlyMonthDataModelFromJson(json);

  Map<String, dynamic> toJson() => _$YearlyMonthDataModelToJson(this);
}

@JsonSerializable()
class YearlyReportModel {
  final int year;
  final List<YearlyMonthDataModel> monthlyData;
  final double totalIncome;
  final double totalExpense;
  final double annualBalance;

  YearlyReportModel({
    required this.year,
    required this.monthlyData,
    required this.totalIncome,
    required this.totalExpense,
    required this.annualBalance,
  });

  factory YearlyReportModel.fromJson(Map<String, dynamic> json) =>
      _$YearlyReportModelFromJson(json);

  Map<String, dynamic> toJson() => _$YearlyReportModelToJson(this);
}

// Balance Sheet Model

@JsonSerializable()
class BalanceSheetModel {
  final DateTime asOfDate;
  final double cashBalance;
  final double bankBalance;
  final double totalAssets;
  final double pendingPayments;
  final double totalLiabilities;
  final double currentBalance;
  final double totalAssetsAndLiabilities;
  final bool isBalanced;

  BalanceSheetModel({
    required this.asOfDate,
    required this.cashBalance,
    required this.bankBalance,
    required this.totalAssets,
    required this.pendingPayments,
    required this.totalLiabilities,
    required this.currentBalance,
    required this.totalAssetsAndLiabilities,
    required this.isBalanced,
  });

  factory BalanceSheetModel.fromJson(Map<String, dynamic> json) =>
      _$BalanceSheetModelFromJson(json);

  Map<String, dynamic> toJson() => _$BalanceSheetModelToJson(this);
}
