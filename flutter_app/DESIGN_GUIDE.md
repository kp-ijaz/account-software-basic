# Madrasa Accounting Software - Design Guide

## Overview

The Madrasa Accounting Software now features a modern, responsive design system that works seamlessly across mobile, tablet, and desktop platforms.

## Design System Architecture

### 1. Design Tokens (`design_system.dart`)

**Spacing Scale:**
- `xs`: 4px - Used for minimal gaps
- `sm`: 8px - Used for small gaps
- `md`: 12px - Default spacing between elements
- `lg`: 16px - Standard spacing
- `xl`: 20px - Large spacing
- `xxl`: 24px - Extra large spacing
- `xxxl`: 32px - Maximum spacing

**Sizing:**
- `cardBorderRadius`: 12px
- `buttonBorderRadius`: 8px
- `inputBorderRadius`: 8px
- Button heights: Small (36px), Medium (44px), Large (52px)
- Icon sizes: Small (20px), Medium (24px), Large (32px)

### 2. Responsive Breakpoints

| Device | Width Range | Grid Columns |
|--------|------------|--------------|
| Mobile | 0 - 480px | 1 |
| Tablet | 481 - 1024px | 2 |
| Desktop | 1025px+ | 3 |

**Layout Behavior:**
- **Mobile**: Bottom navigation bar, full-width content, single column layouts
- **Tablet**: Collapsed sidebar (icons only), 2-column grids
- **Desktop**: Full sidebar with labels, 3-column grids

### 3. Color System

**Primary Colors:**
- Primary Green: `#4CAF50`
- Success: `#4CAF50` (same as primary)
- Error: `#E53935` (red for expenses)
- Warning: `#FBC02D`
- Info: `#1976D2`

**Semantic Colors:**
- Income: Green
- Expense: Red
- Neutral: Grey

**Text Colors:**
- Primary: `#212121`
- Secondary: `#757575`
- Light: `#9E9E9E`

### 4. Typography

- **Display Large**: 32px, Bold
- **Display Medium**: 28px, Bold
- **Title Large**: 20px, Semi-bold
- **Title Medium**: 16px, Medium
- **Body Large**: 16px, Regular
- **Body Medium**: 14px, Regular
- **Body Small**: 12px, Regular

### 5. Component Library

#### AppMetricCard
Displays key metrics with icon and color-coded left border.

```dart
AppMetricCard(
  title: 'Today\'s Income',
  value: 'AED 5,000',
  color: Colors.green,
  icon: Icons.trending_up,
)
```

#### AppSection
Wraps content with a section title and optional "View All" button.

```dart
AppSection(
  title: 'Recent Transactions',
  onViewAll: () {},
  child: child,
)
```

#### AppDataTable
Responsive table for displaying transaction data.

```dart
AppDataTable(
  columns: ['Date', 'Description', 'Amount'],
  rows: [
    ['2026-08-20', 'Income', 'AED 5,000'],
  ],
)
```

#### AppButton
Flexible button with variants (primary, secondary, danger).

```dart
AppButton(
  label: 'Save',
  icon: Icons.save,
  variant: ButtonVariant.primary,
  onPressed: () {},
  isFullWidth: true,
)
```

#### AppStatusBadge
Shows transaction type with color coding.

```dart
AppStatusBadge(
  label: 'Income',
  type: TransactionType.income,
)
```

## Updated Pages

### Dashboard
- 3 sections: Today's Summary, This Month's Summary, Account Balances
- Responsive grid layout (1/2/3 columns based on screen size)
- Recent transactions table with horizontal scroll
- Quick metric cards with icons

### Income Page
- Add Income button with responsive dialog (modal on mobile, dialog on desktop)
- Transaction list with date, category, description, amount, payment method
- Search and filter capabilities
- Category dropdown with predefined income categories

### Expense Page
- Similar to Income page with expense-specific categories
- Responsive form with validation
- Delete and edit capabilities

### Day Book
- Chronological view of all transactions
- Filter buttons (Today, This Week, This Month, Custom)
- Columns: Date, Description, Category, Income, Expense, Balance
- Running balance calculation

### Ledger
- Debit/Credit view with running balance
- Category filter
- Transaction details with timestamps
- Professional accounting format

### Reports
- Report type selector (Monthly, Yearly, Balance Sheet)
- Export PDF functionality
- Summary cards showing totals
- Responsive grid layout for metrics

### Settings
- Madrasa information form
- Currency and financial year selection
- Save changes button
- Change password dialog
- Form validation

### Audit Log
- Action filter chips
- Detailed audit trail table
- Shows date, time, action type, description, user
- Professional audit format

## Layout Components

### Responsive App Layout (`AppLayout`)

**Desktop/Tablet:**
- Navigation rail on left
- Extended on desktop, collapsed on tablet
- Top app bar with title
- Main content area

**Mobile:**
- Top app bar with title and logout
- Main content area
- Bottom navigation bar

## Responsive Design Patterns

### 1. Responsive Grid
```dart
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: ScreenLayout.getGridColumnsForMetrics(context),
    childAspectRatio: 1.2,
    crossAxisSpacing: AppSpacing.lg,
    mainAxisSpacing: AppSpacing.lg,
  ),
)
```

### 2. Responsive Forms
```dart
Row(
  children: [
    Expanded(child: firstField),
    SizedBox(width: AppSpacing.lg),
    Expanded(child: secondField),
  ],
)
```

### 3. Responsive Navigation
- Mobile: BottomNavigationBar with shifting type
- Tablet/Desktop: NavigationRail

## Best Practices

1. **Use Design Tokens**: Always use values from `AppSpacing` and `AppSizing` instead of hardcoded values
2. **Responsive First**: Design for mobile first, then enhance for tablet and desktop
3. **Consistent Spacing**: Use the spacing scale consistently throughout
4. **Color Consistency**: Use the semantic color system for income (green), expense (red)
5. **Icons**: Use Material icons consistently
6. **Typography**: Use theme text styles instead of hardcoded font sizes
7. **Loading States**: Use CircularProgressIndicator for async operations
8. **Error Handling**: Show user-friendly error messages

## Dark Mode Support

The design system supports both light and dark modes through Material 3. Implement dark mode by:

1. Update `AppTheme.darkTheme` in `app_theme.dart`
2. Use semantic colors that respond to brightness
3. Test all pages in both light and dark modes

## Testing Checklist

- [ ] All pages render correctly on mobile (375x667)
- [ ] All pages render correctly on tablet (768x1024)
- [ ] All pages render correctly on desktop (1920x1080)
- [ ] Bottom navigation appears on mobile
- [ ] Sidebar appears on tablet and desktop
- [ ] Metric cards display in responsive grid
- [ ] Forms are readable on all screen sizes
- [ ] Tables scroll horizontally on small screens
- [ ] Buttons are easy to tap on mobile (min 44px height)
- [ ] Text is readable (min 12px font size)
- [ ] Modals show correct UI (dialog on desktop, bottom sheet on mobile)

## Future Enhancements

1. Add animations and transitions
2. Implement dark mode completely
3. Add data visualization charts
4. Implement PDF export functionality
5. Add print styles
6. Implement offline support
7. Add internationalization (i18n)
