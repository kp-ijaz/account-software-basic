export interface AuditLogEntry {
  id: string;
  action: string;
  description: string;
  userId: string;
  userEmail?: string;
  entityType?: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogFilterParams {
  page?: number;
  pageSize?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'action';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogListResponse {
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

export interface AuditState {
  items: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: AuditLogFilterParams;
  summary: AuditLogSummary['data'] | null;
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
