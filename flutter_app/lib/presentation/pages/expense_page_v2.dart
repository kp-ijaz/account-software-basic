import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../widgets/common/modern_layout_pro.dart';
import '../widgets/common/date_picker_field.dart';

class ExpensePageV2 extends StatefulWidget {
  const ExpensePageV2({super.key});

  @override
  State<ExpensePageV2> createState() => _ExpensePageV2State();
}

class _ExpensePageV2State extends State<ExpensePageV2> {
  DateTime? _filterStartDate;
  DateTime? _filterEndDate;
  String _selectedCategory = '';
  String _searchTerm = '';

  final List<Map<String, dynamic>> _expenseData = [
    {
      'date': DateTime(2026, 8, 20),
      'category': 'Teacher Salary',
      'description': 'Monthly salary',
      'amount': 2500.00,
      'method': 'Bank',
    },
    {
      'date': DateTime(2026, 8, 19),
      'category': 'Electricity',
      'description': 'Monthly bill',
      'amount': 500.00,
      'method': 'Bank',
    },
  ];

  final List<String> _categories = [
    'Teacher Salary',
    'Electricity',
    'Water',
    'Food',
    'Maintenance',
    'Stationery',
    'Events',
    'Building Maintenance',
    'Miscellaneous',
  ];

  List<Map<String, dynamic>> get _filteredData {
    return _expenseData.where((item) {
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
    final totalExpense = _filteredData.fold<double>(0, (sum, item) => sum + (item['amount'] as double));

    return ModernLayoutPro(
      title: 'Expenses',
      onNavigate: (route) => context.go(route),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Expense Transactions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(
                      'Total: AED ${currencyFormat.format(totalExpense)}',
                      style: const TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () => _showAddExpenseDialog(context),
                  icon: const Icon(Icons.add_circle_outline, size: 20),
                  label: const Text('Add Expense'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    backgroundColor: Colors.red.shade600,
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

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
                    DropdownButtonFormField<String>(
                      initialValue: _selectedCategory.isEmpty ? null : _selectedCategory,
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
                        const DropdownMenuItem(value: '', child: Text('All Categories')),
                        ..._categories.map((cat) => DropdownMenuItem(value: cat, child: Text(cat))),
                      ],
                      onChanged: (value) => setState(() => _selectedCategory = value ?? ''),
                    ),
                    const SizedBox(height: 12),
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
                                backgroundColor: Colors.red.shade100,
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
                                    onPressed: () => _showEditExpenseDialog(context, item),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.delete, size: 18, color: Colors.red),
                                    onPressed: () => _showDeleteConfirmation(context, item),
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
                      Icon(Icons.inbox, size: 64, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      Text(
                        'No expense records found',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.grey),
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

  void _showAddExpenseDialog(BuildContext context) {
    DateTime selectedDate = DateTime.now();
    String selectedCategory = _categories.first;
    final descController = TextEditingController();
    final amountController = TextEditingController();
    String selectedMethod = 'Cash';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Expense'),
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
                const SizedBox(height: 8),
                DropdownButtonFormField(
                  initialValue: selectedCategory,
                  decoration: const InputDecoration(labelText: 'Category'),
                  items: _categories.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                  onChanged: (value) => setState(() => selectedCategory = value ?? ''),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: descController,
                  decoration: const InputDecoration(labelText: 'Description'),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: amountController,
                  decoration: const InputDecoration(labelText: 'Amount'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField(
                  initialValue: selectedMethod,
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
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Expense added successfully!')),
              );
              Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showEditExpenseDialog(BuildContext context, Map<String, dynamic> item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Expense'),
        content: const Text('Edit expense form'),
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
        title: const Text('Delete Expense'),
        content: Text('Are you sure you want to delete this expense record?\n\n${item['description']} - AED ${item['amount']}'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Expense deleted successfully!')),
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
