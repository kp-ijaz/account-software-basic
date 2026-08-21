import { db } from '../config/database';
import { Prisma } from '@prisma/client';
import { AuditLogEntry, AuditLogFilterParams, AuditLogResponse, AuditLogSummary } from '../types/audit';
import logger from '../utils/logger';

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
      // Don't throw - audit logging should not break main operations
    }
  }

  async getAuditLogs(filters: AuditLogFilterParams): Promise<AuditLogResponse> {
    try {
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 50;
      const skip = (page - 1) * pageSize;

      // Build where clause
      const where: any = {};

      if (filters.action) {
        where.action = filters.action;
      }

      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.createdAt.lte = new Date(filters.endDate);
        }
      }

      if (filters.search) {
        where.OR = [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { action: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await db.auditLog.count({ where });

      // Fetch audit logs with user info
      const auditLogs = await db.auditLog.findMany({
        where,
        include: {
          user: {
            select: { email: true },
          },
        },
        orderBy: {
          createdAt: (filters.sortOrder === 'asc' ? 'asc' : 'desc'),
        },
        skip,
        take: pageSize,
      });

      // Format response
      const items: AuditLogEntry[] = auditLogs.map((log: any) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        userId: log.userId || '',
        userEmail: log.user?.email,
        tableName: log.tableName || undefined,
        recordId: log.recordId || undefined,
        changes: log.newValues || undefined,
        ipAddress: log.ipAddress || undefined,
        userAgent: log.userAgent || undefined,
        createdAt: log.createdAt.toISOString(),
      }));

      const pages = Math.ceil(total / pageSize);

      logger.info(`Audit logs fetched: ${items.length} entries, page ${page}/${pages}`);

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
      const totalEntries = await db.auditLog.count();

      const lastEntry = await db.auditLog.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true },
          },
        },
      });

      // Get action counts
      const actionCounts: Record<string, number> = {};
      const logs = await db.auditLog.findMany();

      logs.forEach((log: any) => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      });

      const formattedLastEntry = lastEntry
        ? {
            id: lastEntry.id,
            action: lastEntry.action,
            description: lastEntry.description,
            userId: lastEntry.userId || '',
            userEmail: lastEntry.user?.email,
            tableName: lastEntry.tableName || undefined,
            recordId: lastEntry.recordId || undefined,
            changes: lastEntry.newValues || undefined,
            ipAddress: lastEntry.ipAddress || undefined,
            userAgent: lastEntry.userAgent || undefined,
            createdAt: lastEntry.createdAt.toISOString(),
          }
        : null;

      return {
        success: true,
        data: {
          totalEntries,
          lastEntry: formattedLastEntry,
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
