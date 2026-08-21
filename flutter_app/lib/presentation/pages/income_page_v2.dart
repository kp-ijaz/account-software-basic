import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../widgets/common/modern_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class IncomePageV2 extends StatefulWidget {
  const IncomePageV2({Key? key}) : super(key: key);

  @override
  State<IncomePageV2> createState() => _IncomePageV2State();
}

class _IncomePageV2State extends State<IncomePageV2> {
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _selectedCategory = '';
  String _searchTerm = '';

  final List<Map<String, dynamic>> _incomeData = [
    {
      'date': DateTime(2026, 8, 20),
      'category': 'Student Fees',
      'description': 'Monthly tuition',
      'amount': 5000.00,
      'method': 'Bank',
    },
    {
      'date': DateTime(2026, 8, 19),
      'category': 'Donations',
      'description': 'Generous donation',
      'amount': 2000.00,
      'method': 'Cash',
    },
  ];

  final List<String> _categories = [
    'Student Fees',
    'Donations',
    'Zakat',
    'Sadaqah',
    'Sponsorship',
    'Building Fund',
    'Other Income',
  ];

  List<Map<String, dynamic>> get _filteredData {
    return _incomeData.where((item) {
      final date = item['date'] as DateTime;
      final matchesDateRange = (_filterStartDate == null || date.isAfter(_filterStartDate!.subtract(const Duration(days: 1)))) &&
          (_filterEndDate == null || date.isBefore(_filterEndDate!.add(const Duration(days: 1))));
      final matchesCategory = _selectedCategory.isEmpty || item['category'] == _selectedCategory;
      final matchesSearch = _searchTerm.isEmpty ||
          (item['description'] as String).toLowerCase().contains(_searchTerm.toLowerCase()) ||
          (item['category'] as String).toLowerCase().contains(_searchTerm.toLowerCase());
      return matchesDateRange && matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat('#,##0.00', 'en_US');
    final totalIncome = _filteredData.fold<double>(0, (sum, item) => sum + (item['amount'] as double));

    return ModernLayoutPro(
      title: 'Income',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with stats
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Income Transactions',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Total: AED ${currencyFormat.format(totalIncome)}',
                      style: const TextStyle(fontSize: 12, color: Colors.green, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () => _showAddIncomeDialog(context),
                  icon: const Icon(Icons.add_circle_outline, size: 20),
                  label: const Text('Add Income'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Filters Section
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Filters', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    // Search
                    TextField(
                      style: const TextStyle(fontSize: 11),
                      decoration: InputDecoration(
                        hintText: 'Search by description or category...',
                        hintStyle: const TextStyle(fontSize: 11),
                        prefixIcon: const Icon(Icons.search, size: 20),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(width: 1),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      onChanged: (value) => setState(() => _searchTerm = value),
                    ),
                    const SizedBox(height: 12),
                    // Date Range
                    Row(
                      children: [
                        Expanded(
                          child: DatePickerField(
                            label: 'From Date',
                            initialValue: _filterStartDate,
                            onDateChanged: (date) => setState(() => _filterStartDate = date),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: DatePickerField(
                            label: 'To Date',
                            initialValue: _filterEndDate,
                            onDateChanged: (date) => setState(() => _filterEndDate = date),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    // Category Filter
                    DropdownButtonFormField<String>(
                      value: _selectedCategory.isEmpty ? null : _selectedCategory,
                      decoration: InputDecoration(
                        labelText: 'Filter by Category',
                        labelStyle: const TextStyle(fontSize: 11),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(width: 1),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      items: [
                        const DropdownMenuItem(value: '', child: Text('All Categories', style: TextStyle(fontSize: 11))),
                        ..._categories.map((cat) => DropdownMenuItem(value: cat, child: Text(cat, style: const TextStyle(fontSize: 11)))),
                      ],
                      onChanged: (value) => setState(() => _selectedCategory = value ?? ''),
                    ),
                    const SizedBox(height: 12),
                    // Clear filters
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _filterStartDate = null;
                          _filterEndDate = null;
                          _selectedCategory = '';
                          _searchTerm = '';
                        });
                      },
                      icon: const Icon(Icons.clear, size: 20),
                      label: const Text('Clear Filters', style: TextStyle(fontSize: 11)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Data Table
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columnSpacing: 16,
                  headingRowHeight: 40,
                  dataRowHeight: 48,
                  columns: const [
                    DataColumn(label: Text('Date', style: TextStyle(fontSize: 11))),
                    DataColumn(label: Text('Category', style: TextStyle(fontSize: 11))),
                    DataColumn(label: Text('Description', style: TextStyle(fontSize: 11))),
                    DataColumn(label: Text('Amount', style: TextStyle(fontSize: 11)), numeric: true),
                    DataColumn(label: Text('Method', style: TextStyle(fontSize: 11))),
                    DataColumn(label: Text('Actions', style: TextStyle(fontSize: 11))),
                  ],
                  rows: _filteredData
                      .map(
                        (item) => DataRow(
                          cells: [
                            DataCell(Text(DateFormat('yyyy-MM-dd').format(item['date']), style: const TextStyle(fontSize: 11))),
                            DataCell(
                              Chip(
                                label: Text(item['category'], style: const TextStyle(fontSize: 10)),
                                backgroundColor: Colors.green.shade100,
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              ),
                            ),
                            DataCell(Text(item['description'], style: const TextStyle(fontSize: 11))),
                            DataCell(
                              Text(
                                'AED ${currencyFormat.format(item['amount'])}',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataCell(Text(item['method'], style: const TextStyle(fontSize: 11))),
                            DataCell(
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.edit, size: 18),
                                    onPressed: () => _showEditIncomeDialog(context, item),
                                    padding: EdgeInsets.zero,
                                    iconSize: 18,
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.delete, size: 18, color: Colors.red),
                                    onPressed: () => _showDeleteConfirmation(context, item),
                                    padding: EdgeInsets.zero,
                                    iconSize: 18,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )
                      .toList(),
                ),
              ),
            ),

            if (_filteredData.isEmpty)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.inbox, size: 48, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      const Text(
                        'No income records found',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _showAddIncomeDialog(BuildContext context) {
    DateTime selectedDate = DateTime.now();
    String selectedCategory = _categories.first;
    final descController = TextEditingController();
    final amountController = TextEditingController();
    String selectedMethod = 'Cash';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Income', style: TextStyle(fontSize: 16)),
        content: SingleChildScrollView(
          child: StatefulBuilder(
            builder: (context, setState) => Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DatePickerField(
                  label: 'Date',
                  initialValue: selectedDate,
                  onDateChanged: (date) => setState(() => selectedDate = date),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField(
                  value: selectedCategory,
                  decoration: const InputDecoration(labelText: 'Category'),
                  items: _categories.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                  onChanged: (value) => setState(() => selectedCategory = value ?? ''),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: descController,
                  decoration: const InputDecoration(labelText: 'Description'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: amountController,
                  decoration: const InputDecoration(labelText: 'Amount'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField(
                  value: selectedMethod,
                  decoration: const InputDecoration(labelText: 'Payment Method'),
                  items: ['Cash', 'Bank']
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
                  onChanged: (value) => setState(() => selectedMethod = value ?? ''),
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              // TODO: Call API to save income
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Income added successfully!')),
              );
              Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showEditIncomeDialog(BuildContext context, Map<String, dynamic> item) {
    // Similar to add but with pre-filled values
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Income'),
        content: const Text('Edit income form'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(onPressed: () => Navigator.pop(context), child: const Text('Save')),
        ],
      ),
    );
  }

  void _showDeleteConfirmation(BuildContext context, Map<String, dynamic> item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Income'),
        content: Text('Are you sure you want to delete this income record?\n\n${item['description']} - AED ${item['amount']}'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              // TODO: Call API to delete
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Income deleted successfully!')),
              );
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
