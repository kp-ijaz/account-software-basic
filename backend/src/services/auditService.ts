import { db } from '../config/database';
import { AuditLogEntry, AuditLogFilterParams, AuditLogResponse, AuditLogSummary } from '../types/audit';
import logger from '../utils/logger';

function formatLog(log: any): AuditLogEntry {
  return {
    id: log.id,
    action: log.action,
    description: log.description,
    userId: log.userId || '',
    userEmail: log.user?.email,
    tableName: log.tableName || undefined,
    recordId: log.recordId || log.transactionId || undefined,
    transactionId: log.transactionId || undefined,
    oldValues: log.oldValues || null,
    newValues: log.newValues || null,
    ipAddress: log.ipAddress || undefined,
    userAgent: log.userAgent || undefined,
    createdAt: log.createdAt.toISOString(),
  };
}

function moduleWhere(module?: string) {
  if (!module) return {};

  switch (module) {
    case 'income':
      return { action: { startsWith: 'INCOME_' } };
    case 'expense':
      return { action: { startsWith: 'EXPENSE_' } };
    case 'security':
      return { action: { in: ['LOGIN', 'LOGOUT', 'CHANGE_PASSWORD'] } };
    case 'settings':
      return { action: { startsWith: 'SETTINGS_' } };
    case 'reports':
      return { action: { startsWith: 'REPORT_' } };
    default:
      return {};
  }
}

class AuditService {
  async logAction(
    action: string,
    description: string,
    userId: string,
    tableName?: string,
    recordId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          action,
          description,
          userId: userId || undefined,
          tableName,
          recordId,
          newValues: changes,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      logger.error(`Error logging audit action: ${error}`);
    }
  }

  async getAuditLogs(filters: AuditLogFilterParams): Promise<AuditLogResponse> {
    try {
      const page = filters.page || 1;
      const pageSize = Math.min(filters.pageSize || 50, 100);
      const skip = (page - 1) * pageSize;

      const where: any = {
        ...moduleWhere(filters.module),
      };

      if (filters.action) {
        where.action = filters.action;
      }

      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000`);
        }
        if (filters.endDate) {
          where.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999`);
        }
      }

      if (filters.search) {
        where.OR = [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { action: { contains: filters.search, mode: 'insensitive' } },
          { recordId: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const total = await db.auditLog.count({ where });

      const auditLogs = await db.auditLog.findMany({
        where,
        include: {
          user: {
            select: { email: true, username: true },
          },
        },
        orderBy: {
          createdAt: filters.sortOrder === 'asc' ? 'asc' : 'desc',
        },
        skip,
        take: pageSize,
      });

      const items = auditLogs.map(formatLog);
      const pages = Math.ceil(total / pageSize);

      return {
        success: true,
        data: {
          items,
          total,
          page,
          pageSize,
          pages,
        },
      };
    } catch (error) {
      logger.error(`Error fetching audit logs: ${error}`);
      throw error;
    }
  }

  async getAuditLogSummary(): Promise<AuditLogSummary> {
    try {
      const [totalEntries, lastEntry, grouped] = await Promise.all([
        db.auditLog.count(),
        db.auditLog.findFirst({
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { email: true, username: true },
            },
          },
        }),
        db.auditLog.groupBy({
          by: ['action'],
          _count: { action: true },
        }),
      ]);

      const actionCounts: Record<string, number> = {};
      grouped.forEach((row) => {
        actionCounts[row.action] = row._count.action;
      });

      return {
        success: true,
        data: {
          totalEntries,
          lastEntry: lastEntry ? formatLog(lastEntry) : null,
          actionCounts,
        },
      };
    } catch (error) {
      logger.error(`Error fetching audit summary: ${error}`);
      throw error;
    }
  }
}

export default new AuditService();
