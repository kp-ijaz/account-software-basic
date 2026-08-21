import 'package:flutter/material.dart';
import '../widgets/common/app_layout.dart';
import '../widgets/common/design_widgets.dart';
import '../../core/theme/design_system.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _madrasaNameController;
  late TextEditingController _addressController;
  late TextEditingController _phoneController;
  String _currency = 'AED';
  String _financialYear = '2026';

  @override
  void initState() {
    super.initState();
    _madrasaNameController = TextEditingController(text: 'Al-Noor Madrasa');
    _addressController = TextEditingController(text: '123 Main Street, Dubai');
    _phoneController = TextEditingController(text: '+971 4 123 4567');
  }

  @override
  void dispose() {
    _madrasaNameController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: 'Settings',
      child: SingleChildScrollView(
        padding: AppSpacing.paddingLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            const SizedBox(height: AppSpacing.xxl),
            _buildSettingsForm(context),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Settings',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'Manage Madrasa information and preferences',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }

  Widget _buildSettingsForm(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppSizing.cardBorderRadius),
        color: Theme.of(context).colorScheme.surface,
        boxShadow: AppShadows.cardShadows,
      ),
      padding: AppSpacing.paddingLg,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Madrasa Information',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: AppSpacing.lg),
            _buildTextFormField(
              controller: _madrasaNameController,
              label: 'Madrasa Name',
              icon: Icons.school,
            ),
            const SizedBox(height: AppSpacing.lg),
            _buildTextFormField(
              controller: _addressController,
              label: 'Address',
              icon: Icons.location_on,
              maxLines: 2,
            ),
            const SizedBox(height: AppSpacing.lg),
            _buildTextFormField(
              controller: _phoneController,
              label: 'Phone Number',
              icon: Icons.phone,
            ),
            const SizedBox(height: AppSpacing.lg),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Currency',
                      prefixIcon: const Icon(Icons.attach_money),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
                      ),
                    ),
                    value: _currency,
                    items: ['AED', 'USD', 'EUR']
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (value) => setState(() => _currency = value ?? 'AED'),
                  ),
                ),
                const SizedBox(width: AppSpacing.lg),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Financial Year',
                      prefixIcon: const Icon(Icons.calendar_today),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
                      ),
                    ),
                    value: _financialYear,
                    items: ['2024', '2025', '2026', '2027']
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (value) => setState(() => _financialYear = value ?? '2026'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.xxl),
            _buildActionButtons(context),
          ],
        ),
      ),
    );
  }

  Widget _buildTextFormField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
        ),
      ),
      validator: (value) {
        if (value?.isEmpty ?? true) {
          return '$label is required';
        }
        return null;
      },
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: AppButton(
            label: 'Save Changes',
            isFullWidth: true,
            onPressed: () => _saveSettings(),
          ),
        ),
        const SizedBox(width: AppSpacing.lg),
        Expanded(
          child: AppButton(
            label: 'Change Password',
            variant: ButtonVariant.secondary,
            isFullWidth: true,
            onPressed: () => _showChangePasswordDialog(context),
          ),
        ),
      ],
    );
  }

  void _saveSettings() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings saved successfully')),
      );
    }
  }

  void _showChangePasswordDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Change Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Current Password',
                prefixIcon: const Icon(Icons.lock),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
                ),
              ),
              obscureText: true,
            ),
            const SizedBox(height: AppSpacing.lg),
            TextFormField(
              decoration: InputDecoration(
                labelText: 'New Password',
                prefixIcon: const Icon(Icons.lock),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
                ),
              ),
              obscureText: true,
            ),
            const SizedBox(height: AppSpacing.lg),
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Confirm Password',
                prefixIcon: const Icon(Icons.lock),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSizing.inputBorderRadius),
                ),
              ),
              obscureText: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          AppButton(
            label: 'Update',
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }
}
