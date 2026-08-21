# DATABASE BACKUP AND RECOVERY GUIDE

**System**: Madrasa Accounting Software
**Database**: PostgreSQL
**Version**: 1.0
**Date**: 2026-08-20

---

## TABLE OF CONTENTS

1. [Backup Strategy](#backup-strategy)
2. [Automated Backups](#automated-backups)
3. [Manual Backups](#manual-backups)
4. [Recovery Procedures](#recovery-procedures)
5. [Verification](#verification)
6. [Off-Site Storage](#off-site-storage)

---

## BACKUP STRATEGY

### Backup Approach

**Automated Backups** (Daily):
- Frequency: Every 24 hours at 02:00 UTC
- Retention: 30 days
- Location: Database server storage + Cloud backup
- Type: Full database dumps

**Manual Backups** (On-Demand):
- Before major updates or migrations
- Before schema changes
- When requested by administrator
- Before version upgrades

### Backup Retention Policy

| Backup Type | Retention | Location |
|------------|-----------|----------|
| Daily automated | 30 days | Database server + S3 |
| Weekly consolidated | 3 months | S3 only |
| Monthly full | 1 year | S3 + Google Drive |
| Pre-release | Permanent | Google Drive (labeled) |

---

## AUTOMATED BACKUPS

### Supabase (Recommended for Production)

Supabase provides automatic daily backups automatically:

**Features**:
- Daily automatic backups
- 30-day point-in-time recovery window
- Automated backups stored in redundant storage
- One-click recovery to any point in time

**Dashboard Access**:
1. Go to Supabase Dashboard
2. Select your project
3. Navigate to: Backups → Database Backups
4. View backup history and recovery options

**No Configuration Required** - Supabase handles this automatically

### For Self-Hosted PostgreSQL

If running PostgreSQL locally/on VPS:

```bash
# Create backup directory
mkdir -p /backups/madrasa-accounting

# Schedule backup via cron (runs daily at 2 AM)
# Edit crontab:
crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-madrasa.sh
```

**Create the backup script** (`/usr/local/bin/backup-madrasa.sh`):

```bash
#!/bin/bash

BACKUP_DIR="/backups/madrasa-accounting"
DB_NAME="madrasa_accounting"
DB_USER="postgres"
DB_HOST="localhost"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/madrasa_accounting_$TIMESTAMP.sql"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Log backup completion
echo "[$(date)] Backup completed: $BACKUP_FILE.gz" >> /var/log/madrasa-backup.log
```

**Make script executable**:
```bash
chmod +x /usr/local/bin/backup-madrasa.sh
```

---

## MANUAL BACKUPS

### Backup using pg_dump (PostgreSQL)

```bash
# Full database backup
pg_dump -h localhost -U postgres -d madrasa_accounting > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup (recommended)
pg_dump -h localhost -U postgres -d madrasa_accounting | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Custom format (allows selective restore)
pg_dump -h localhost -U postgres -F c -d madrasa_accounting > backup_$(date +%Y%m%d_%H%M%S).dump
```

### Backup using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create a backup
supabase db pull --db-url postgresql://user:password@db.supabase.co:5432/postgres > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Backup Size Estimation

For planning backup storage:
- Empty database: ~5 MB
- With default data: ~10 MB
- With 1 year of data (1000+ transactions): ~50-100 MB
- With 5 years of data: ~200-300 MB

---

## RECOVERY PROCEDURES

### Full Database Recovery

**From Supabase Dashboard**:
1. Go to Backups → Database Backups
2. Click "Restore" on desired backup
3. Confirm recovery point
4. System will restore to backup state
5. Verify recovery was successful

**From SQL dump (pg_restore)**:

```bash
# Using pg_restore with custom format
pg_restore -h localhost -U postgres -d madrasa_accounting backup_20260820_120000.dump

# Using SQL dump directly (careful, will recreate objects)
psql -h localhost -U postgres -d madrasa_accounting < backup_20260820_120000.sql

# Alternative (creates new database)
createdb -h localhost -U postgres madrasa_accounting_restored
pg_restore -h localhost -U postgres -d madrasa_accounting_restored backup_20260820_120000.dump
```

### Point-in-Time Recovery (PITR)

**From Supabase**:
1. Go to Backups → Database Backups
2. Under "Restore", select specific time
3. Choose exact timestamp for recovery
4. Click "Restore at this point"
5. Confirm recovery

**Manual PITR with PostgreSQL WAL** (Advanced):
- Requires WAL archiving enabled
- Supabase handles this automatically
- Contact Supabase support for assistance

### Selective Table Recovery

```bash
# Restore only specific table from custom format backup
pg_restore -h localhost -U postgres -d madrasa_accounting -t Incomes backup_20260820_120000.dump

# List all objects in backup file
pg_restore -l backup_20260820_120000.dump

# Selective restore using restore list
pg_restore -L backup.list -h localhost -U postgres -d madrasa_accounting backup_20260820_120000.dump
```

---

## VERIFICATION

### Verify Backup Integrity

```bash
# Check if backup file is valid SQL
head -n 50 backup_20260820_120000.sql

# Verify custom format backup
pg_restore -l backup_20260820_120000.dump | head

# Check gzip backup integrity
gunzip -t backup_20260820_120000.sql.gz
```

### Verify Recovery Success

After recovery, run these checks:

```sql
-- Count records in each table
SELECT 'Admins' as table_name, COUNT(*) as count FROM "Admins"
UNION ALL
SELECT 'Incomes', COUNT(*) FROM "Incomes"
UNION ALL
SELECT 'Expenses', COUNT(*) FROM "Expenses"
UNION ALL
SELECT 'IncomeCategories', COUNT(*) FROM "IncomeCategories"
UNION ALL
SELECT 'ExpenseCategories', COUNT(*) FROM "ExpenseCategories"
UNION ALL
SELECT 'Settings', COUNT(*) FROM "Settings"
UNION ALL
SELECT 'AuditLogs', COUNT(*) FROM "AuditLogs";

-- Check latest transactions
SELECT * FROM "Incomes" ORDER BY "CreatedAt" DESC LIMIT 5;
SELECT * FROM "Expenses" ORDER BY "CreatedAt" DESC LIMIT 5;

-- Verify integrity constraints
SELECT * FROM "Incomes" WHERE "Amount" <= 0;  -- Should return 0 rows
SELECT * FROM "Expenses" WHERE "Amount" <= 0;  -- Should return 0 rows
```

### Backup Restoration Checklist

- [ ] Backup file exists and is readable
- [ ] Backup file size is reasonable
- [ ] Backup integrity verified
- [ ] Database is accessible
- [ ] All tables present after restore
- [ ] Row counts match expectations
- [ ] Check constraints are intact
- [ ] Foreign key relationships valid
- [ ] Indexes are present
- [ ] Recent audit logs are recovered
- [ ] Admin account is present
- [ ] Categories are present

---

## OFF-SITE STORAGE

### Google Drive Backup

**Automated Upload** (via script):

```bash
#!/bin/bash
# backup-to-drive.sh

BACKUP_FILE="$1"
FOLDER_ID="your-google-drive-folder-id"

# Install Google Drive CLI if needed
# go install github.com/prasmussen/gdrive@latest

# Upload backup
gdrive upload --parent $FOLDER_ID $BACKUP_FILE

# Log upload
echo "[$(date)] Uploaded $BACKUP_FILE to Google Drive" >> /var/log/madrasa-backup.log
```

### AWS S3 Backup

**Automated Upload** (via AWS CLI):

```bash
#!/bin/bash
# backup-to-s3.sh

BACKUP_FILE="$1"
S3_BUCKET="s3://madrasa-accounting-backups"

# Upload backup
aws s3 cp $BACKUP_FILE $S3_BUCKET/$(date +%Y/%m)/ --storage-class GLACIER

# Set lifecycle policy (move old backups to Glacier after 30 days)
aws s3api put-bucket-lifecycle-configuration \
  --bucket madrasa-accounting-backups \
  --lifecycle-configuration file://lifecycle.json
```

**lifecycle.json**:
```json
{
  "Rules": [
    {
      "Id": "archive-old-backups",
      "Status": "Enabled",
      "Prefix": "backups/",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

### Combined Backup Strategy

```bash
#!/bin/bash
# complete-backup.sh

BACKUP_DIR="/backups/madrasa-accounting"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/madrasa_accounting_$TIMESTAMP.sql.gz"

# 1. Create backup
pg_dump -h localhost -U postgres -d madrasa_accounting | gzip > $BACKUP_FILE

# 2. Upload to Google Drive
./backup-to-drive.sh $BACKUP_FILE

# 3. Upload to AWS S3
./backup-to-s3.sh $BACKUP_FILE

# 4. Keep local backup (30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# 5. Log completion
echo "[$(date)] Full backup completed: $BACKUP_FILE" >> /var/log/madrasa-backup.log
```

---

## DISASTER RECOVERY PLAN

### Recovery Time Objective (RTO): 4 Hours
### Recovery Point Objective (RPO): 24 Hours

### Disaster Recovery Steps

1. **Assess the Situation** (15 minutes)
   - Identify what data is lost
   - Determine recovery point needed
   - Check backup availability

2. **Prepare Recovery Environment** (30 minutes)
   - Ensure database server is accessible
   - Verify database credentials
   - Check backup file integrity

3. **Perform Recovery** (1-2 hours)
   - Stop application server
   - Connect to database
   - Execute restore command
   - Verify recovery

4. **Verify Data** (30 minutes)
   - Run verification queries
   - Check all tables are present
   - Verify record counts
   - Test application connectivity

5. **Resume Operations** (15 minutes)
   - Start application server
   - Run health checks
   - Verify all features work
   - Test with live users

6. **Post-Recovery** (Ongoing)
   - Document incident
   - Review backup procedures
   - Update recovery documentation
   - Conduct post-mortem

---

## BACKUP SCHEDULE

```
DAILY SCHEDULE (UTC):
  02:00 - Database full backup
  02:30 - Compress backup
  03:00 - Upload to cloud storage
  04:00 - Cleanup old local backups

WEEKLY (Every Sunday):
  01:00 - Full consolidated backup
  02:00 - Upload to archive storage

MONTHLY (1st of month):
  01:00 - Full monthly backup
  03:00 - Duplicate to Google Drive & S3
```

---

## TESTING BACKUPS

**Monthly Backup Test** (1st of each month):

```bash
#!/bin/bash
# test-backup-restore.sh

BACKUP_FILE="$1"
TEST_DB="madrasa_accounting_test_restore"

# Drop test database if exists
dropdb -h localhost -U postgres $TEST_DB 2>/dev/null || true

# Create test database
createdb -h localhost -U postgres $TEST_DB

# Restore from backup
pg_restore -h localhost -U postgres -d $TEST_DB $BACKUP_FILE

# Run verification queries
psql -h localhost -U postgres -d $TEST_DB << EOF
SELECT COUNT(*) as total_records FROM "Incomes";
SELECT COUNT(*) as total_records FROM "Expenses";
SELECT * FROM "Admins";
SELECT COUNT(*) as audit_count FROM "AuditLogs";
EOF

# Clean up test database
dropdb -h localhost -U postgres $TEST_DB

echo "[$(date)] Backup restore test completed successfully"
```

---

## IMPORTANT NOTES

1. **Never store backups in the same physical location as production database**
2. **Test restore procedures monthly**
3. **Keep backup passwords/encryption keys separate from backups**
4. **Monitor backup job logs for failures**
5. **Update documentation after each recovery**
6. **Train team on recovery procedures**
7. **Have documented runbooks for common scenarios**

---

**Last Updated**: 2026-08-20
**Next Review**: 2026-09-20
