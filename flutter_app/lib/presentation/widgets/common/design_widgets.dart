import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/design_system.dart';

class AppMetricCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  final IconData? icon;
  final VoidCallback? onTap;
  final bool isLoading;

  const AppMetricCard({
    required this.title,
    required this.value,
    required this.color,
    this.icon,
    this.onTap,
    this.isLoading = false,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSizing.cardBorderRadius),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppSizing.cardBorderRadius),
            color: Theme.of(context).colorScheme.surface,
            border: Border(
              left: BorderSide(color: color, width: 5),
            ),
            boxShadow: AppShadows.cardShadows,
          ),
          padding: AppSpacing.paddingLg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: Icon(
                    icon,
                    color: color,
                    size: AppSizing.iconLarge,
                  ),
                ),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w500,
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: AppSpacing.sm),
              if (isLoading)
                const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              else
                Text(
                  value,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class AppSection extends StatelessWidget {
  final String title;
  final Widget child;
  final EdgeInsets? padding;
  final VoidCallback? onViewAll;

  const AppSection({
    required this.title,
    required this.child,
    this.padding,
    this.onViewAll,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? AppSpacing.verticalPaddingLg,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ),
              if (onViewAll != null)
                TextButton(
                  onPressed: onViewAll,
                  child: const Text('View All'),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          child,
        ],
      ),
    );
  }
}

class AppDataTable extends StatelessWidget {
  final List<String> columns;
  final List<List<String>> rows;
  final ScrollController? scrollController;
  final bool isLoading;

  const AppDataTable({
    required this.columns,
    required this.rows,
    this.scrollController,
    this.isLoading = false,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Center(
        child: CircularProgressIndicator(
          color: AppColors.primary,
        ),
      );
    }

    if (rows.isEmpty) {
      return Center(
        child: Padding(
          padding: AppSpacing.paddingXl,
          child: Text(
            'No data available',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
      );
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      controller: scrollController,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppSizing.cardBorderRadius),
          color: Theme.of(context).colorScheme.surface,
          boxShadow: AppShadows.cardShadows,
        ),
        child: DataTable(
          columns: columns
              .map((col) => DataColumn(
                    label: Text(
                      col,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ))
              .toList(),
          rows: rows
              .map((row) => DataRow(
                    cells: row
                        .map((cell) => DataCell(
                              Text(
                                cell,
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ))
                        .toList(),
                  ))
              .toList(),
        ),
      ),
    );
  }
}

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final ButtonVariant variant;
  final IconData? icon;

  const AppButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.isFullWidth = false,
    this.variant = ButtonVariant.primary,
    this.icon,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    late ButtonStyle style;

    switch (variant) {
      case ButtonVariant.primary:
        style = ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: Size(isFullWidth ? double.infinity : 0, AppSizing.buttonHeightMedium),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSizing.buttonBorderRadius),
          ),
        );
        break;
      case ButtonVariant.secondary:
        style = OutlinedButton.styleFrom(
          side: const BorderSide(color: AppColors.primary),
          minimumSize: Size(isFullWidth ? double.infinity : 0, AppSizing.buttonHeightMedium),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSizing.buttonBorderRadius),
          ),
        );
        break;
      case ButtonVariant.danger:
        style = ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
          foregroundColor: Colors.white,
          minimumSize: Size(isFullWidth ? double.infinity : 0, AppSizing.buttonHeightMedium),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSizing.buttonBorderRadius),
          ),
        );
        break;
    }

    if (isLoading) {
      return ElevatedButton(
        style: style,
        onPressed: null,
        child: const SizedBox(
          height: 20,
          width: 20,
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            strokeWidth: 2,
          ),
        ),
      );
    }

    if (icon != null) {
      return ElevatedButton.icon(
        style: style,
        onPressed: onPressed,
        icon: Icon(icon),
        label: Text(label),
      );
    }

    return ElevatedButton(
      style: style,
      onPressed: onPressed,
      child: Text(label),
    );
  }
}

enum ButtonVariant { primary, secondary, danger }

class AppStatusBadge extends StatelessWidget {
  final String label;
  final TransactionType type;

  const AppStatusBadge({
    required this.label,
    required this.type,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final (bgColor, textColor) = type == TransactionType.income
        ? (Colors.green.shade100, Colors.green.shade700)
        : (Colors.red.shade100, Colors.red.shade700);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: textColor,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

enum TransactionType { income, expense }
