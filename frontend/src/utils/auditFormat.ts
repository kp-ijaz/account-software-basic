import { AuditLogEntry, AUDIT_ACTION_LABELS } from '../types/audit';
import { formatINR } from './currency';

export type AuditEventKind = 'created' | 'updated' | 'deleted' | 'security' | 'other';

const HIDDEN_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'userId',
  'incomeCategoryId',
  'expenseCategoryId',
  'password',
  'passwordHash',
  'token',
]);

const FIELD_LABELS: Record<string, string> = {
  amount: 'Amount',
  date: 'Date',
  description: 'Description',
  paymentMethod: 'Payment method',
  reference: 'Reference',
  type: 'Type',
  name: 'Name',
  madrasaName: 'Madrasa name',
  address: 'Address',
  phone: 'Phone',
  currency: 'Currency',
  financialYear: 'Financial year',
  incomeCategory: 'Income category',
  expenseCategory: 'Expense category',
};

export function getAuditActionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] || action.replace(/_/g, ' ').toLowerCase();
}

export function getAuditModule(action: string, tableName?: string): string {
  if (action.startsWith('INCOME_')) return 'Income';
  if (action.startsWith('EXPENSE_')) return 'Expense';
  if (action.startsWith('SETTINGS_')) return 'Settings';
  if (action.startsWith('REPORT_')) return 'Reports';
  if (['LOGIN', 'LOGOUT', 'CHANGE_PASSWORD'].includes(action)) return 'Security';
  if (tableName === 'Transaction') return 'Transaction';
  return tableName || 'System';
}

export function getAuditEventKind(action: string): AuditEventKind {
  if (action.includes('CREATED')) return 'created';
  if (action.includes('UPDATED')) return 'updated';
  if (action.includes('DELETED')) return 'deleted';
  if (['LOGIN', 'LOGOUT', 'CHANGE_PASSWORD'].includes(action)) return 'security';
  return 'other';
}

export function formatAuditDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function unwrapValue(value: unknown): unknown {
  if (value && typeof value === 'object' && 'name' in (value as object)) {
    return (value as { name: unknown }).name;
  }
  return value;
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';

  const unwrapped = unwrapValue(value);

  if (key === 'amount' && (typeof unwrapped === 'number' || typeof unwrapped === 'string')) {
    const amount = Number(unwrapped);
    return Number.isNaN(amount) ? String(unwrapped) : formatINR(amount);
  }

  if ((key === 'date' || key.toLowerCase().includes('at')) && typeof unwrapped === 'string') {
    const parsed = new Date(unwrapped);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  if (typeof unwrapped === 'object') {
    try {
      return JSON.stringify(unwrapped);
    } catch {
      return String(unwrapped);
    }
  }

  return String(unwrapped);
}

export interface AuditChangeRow {
  field: string;
  label: string;
  before: string;
  after: string;
  changed: boolean;
}

export function getAuditChanges(entry: AuditLogEntry): AuditChangeRow[] {
  const oldValues = (entry.oldValues || {}) as Record<string, unknown>;
  const newValues = (entry.newValues || entry.changes || {}) as Record<string, unknown>;
  const keys = Array.from(new Set([...Object.keys(oldValues), ...Object.keys(newValues)]))
    .filter((key) => !HIDDEN_FIELDS.has(key));

  return keys.map((field) => {
    const beforeRaw = unwrapValue(oldValues[field]);
    const afterRaw = unwrapValue(newValues[field]);
    const before = formatFieldValue(field, oldValues[field]);
    const after = formatFieldValue(field, newValues[field]);
    return {
      field,
      label: FIELD_LABELS[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
      before,
      after,
      changed: JSON.stringify(beforeRaw) !== JSON.stringify(afterRaw),
    };
  });
}

export function getAuditAmount(entry: AuditLogEntry): string | null {
  const source = (entry.newValues || entry.oldValues || entry.changes) as Record<string, unknown> | null;
  if (!source || source.amount === undefined || source.amount === null) return null;
  const amount = Number(source.amount);
  if (Number.isNaN(amount)) return null;
  return formatINR(amount);
}

export function shortenRecordId(id?: string): string {
  if (!id) return '-';
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}
