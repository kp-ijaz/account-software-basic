class IncomeModel {
  final String id;
  final String categoryId;
  final String categoryName;
  final double amount;
  final DateTime date;
  final String description;
  final String paymentMethod;
  final DateTime createdAt;
  final DateTime updatedAt;

  IncomeModel({
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

  factory IncomeModel.fromJson(Map<String, dynamic> json) {
    return IncomeModel(
      id: json['id'] as String? ?? '',
      categoryId: json['categoryId'] as String? ?? '',
      categoryName: json['categoryName'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      date: json['date'] != null ? DateTime.parse(json['date'] as String) : DateTime.now(),
      description: json['description'] as String? ?? '',
      paymentMethod: json['paymentMethod'] as String? ?? 'Cash',
      createdAt: DateTime.parse(json['createdAt'] as String? ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] as String? ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'categoryId': categoryId,
      'categoryName': categoryName,
      'amount': amount,
      'date': date.toIso8601String(),
      'description': description,
      'paymentMethod': paymentMethod,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class CreateIncomeRequest {
  final String categoryId;
  final double amount;
  final DateTime date;
  final String description;
  final String paymentMethod;

  CreateIncomeRequest({
    required this.categoryId,
    required this.amount,
    required this.date,
    required this.description,
    required this.paymentMethod,
  });

  Map<String, dynamic> toJson() {
    return {
      'categoryId': categoryId,
      'amount': amount,
      'date': date.toIso8601String(),
      'description': description,
      'paymentMethod': paymentMethod,
    };
  }
}

class IncomeListResponse {
  final List<IncomeModel> items;
  final int totalCount;
  final int pageNumber;
  final int pageSize;

  IncomeListResponse({
    required this.items,
    required this.totalCount,
    required this.pageNumber,
    required this.pageSize,
  });

  factory IncomeListResponse.fromJson(Map<String, dynamic> json) {
    return IncomeListResponse(
      items: (json['items'] as List?)?.map((e) => IncomeModel.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      totalCount: json['totalCount'] as int? ?? 0,
      pageNumber: json['pageNumber'] as int? ?? 1,
      pageSize: json['pageSize'] as int? ?? 10,
    );
  }
}
