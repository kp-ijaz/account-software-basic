export interface AuditLogEntry {
  id: string;
  action: string;
  description: string;
  userId: string;
  userEmail?: string;
  tableName?: string;
  recordId?: string;
  transactionId?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogFilterParams {
  page?: number;
  pageSize?: number;
  action?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'action';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogResponse {
  success: boolean;
  data: {
    items: AuditLogEntry[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}

export interface AuditLogSummary {
  success: boolean;
  data: {
    totalEntries: number;
    lastEntry: AuditLogEntry | null;
    actionCounts: Record<string, number>;
  };
}

export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  INCOME_CREATED: 'INCOME_CREATED',
  INCOME_UPDATED: 'INCOME_UPDATED',
  INCOME_DELETED: 'INCOME_DELETED',
  EXPENSE_CREATED: 'EXPENSE_CREATED',
  EXPENSE_UPDATED: 'EXPENSE_UPDATED',
  EXPENSE_DELETED: 'EXPENSE_DELETED',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  REPORT_GENERATED: 'REPORT_GENERATED',
} as const;
