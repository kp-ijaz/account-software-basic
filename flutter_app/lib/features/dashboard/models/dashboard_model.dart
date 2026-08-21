import 'package:json_annotation/json_annotation.dart';

part 'dashboard_model.g.dart';

@JsonSerializable()
class RecentTransactionModel {
  final String transactionId;
  final DateTime date;
  final String description;
  final String category;
  final double amount;
  final String type; // "Income" or "Expense"
  final String paymentMethod;

  RecentTransactionModel({
    required this.transactionId,
    required this.date,
    required this.description,
    required this.category,
    required this.amount,
    required this.type,
    required this.paymentMethod,
  });

  factory RecentTransactionModel.fromJson(Map<String, dynamic> json) =>
      _$RecentTransactionModelFromJson(json);

  Map<String, dynamic> toJson() => _$RecentTransactionModelToJson(this);
}

@JsonSerializable()
class MonthlyChartDataModel {
  final int month;
  final String monthName;
  final double income;
  final double expense;
  final double balance;

  MonthlyChartDataModel({
    required this.month,
    required this.monthName,
    required this.income,
    required this.expense,
    required this.balance,
  });

  factory MonthlyChartDataModel.fromJson(Map<String, dynamic> json) =>
      _$MonthlyChartDataModelFromJson(json);

  Map<String, dynamic> toJson() => _$MonthlyChartDataModelToJson(this);
}

@JsonSerializable()
class DashboardSummaryModel {
  // Today's metrics
  final double todayIncome;
  final double todayExpense;
  final double todayBalance;

  // This month's metrics
  final double thisMonthIncome;
  final double thisMonthExpense;
  final double thisMonthBalance;

  // Current balance (all time)
  final double currentCashBalance;
  final double currentBankBalance;
  final double totalCurrentBalance;

  // Recent transactions
  final List<RecentTransactionModel> recentTransactions;

  // Chart data
  final List<MonthlyChartDataModel> monthlyChartData;

  DashboardSummaryModel({
    required this.todayIncome,
    required this.todayExpense,
    required this.todayBalance,
    required this.thisMonthIncome,
    required this.thisMonthExpense,
    required this.thisMonthBalance,
    required this.currentCashBalance,
    required this.currentBankBalance,
    required this.totalCurrentBalance,
    required this.recentTransactions,
    required this.monthlyChartData,
  });

  factory DashboardSummaryModel.fromJson(Map<String, dynamic> json) =>
      _$DashboardSummaryModelFromJson(json);

  Map<String, dynamic> toJson() => _$DashboardSummaryModelToJson(this);
}
