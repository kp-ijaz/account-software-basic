import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DatePickerField extends StatefulWidget {
  final String label;
  final DateTime? initialValue;
  final Function(DateTime) onDateChanged;
  final String? hint;

  const DatePickerField({
    required this.label,
    required this.onDateChanged,
    this.initialValue,
    this.hint,
    Key? key,
  }) : super(key: key);

  @override
  State<DatePickerField> createState() => _DatePickerFieldState();
}

class _DatePickerFieldState extends State<DatePickerField> {
  late DateTime _selectedDate;
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.initialValue ?? DateTime.now();
    _controller = TextEditingController(
      text: DateFormat('yyyy-MM-dd').format(_selectedDate),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _controller.text = DateFormat('yyyy-MM-dd').format(_selectedDate);
      });
      widget.onDateChanged(_selectedDate);
    }
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: _controller,
      decoration: InputDecoration(
        labelText: widget.label,
        hintText: widget.hint ?? 'Select a date',
        prefixIcon: const Icon(Icons.calendar_today),
        suffixIcon: IconButton(
          icon: const Icon(Icons.clear),
          onPressed: () {
            _controller.clear();
            setState(() {
              _selectedDate = DateTime.now();
            });
            widget.onDateChanged(_selectedDate);
          },
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Colors.grey.shade300,
          ),
        ),
      ),
      readOnly: true,
      onTap: _selectDate,
    );
  }
}
