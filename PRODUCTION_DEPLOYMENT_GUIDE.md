# Production Deployment Guide

**Madrasa Accounting Software - MERN Stack**

---

## Overview

This guide provides comprehensive instructions for deploying the Madrasa Accounting Software to production using Render (backend), Vercel (frontend), and Supabase (database).

**Phase:** 16 (Production Deployment)
**Status:** Implementation Guide
**Timeline:** 1-2 days to complete

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Vercel (HTTPS) │
                    │   Frontend      │
                    │  React/Next     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Render HTTPS  │
                    │   API Server    │
                    │  Express/Node   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Supabase    │
                    │   PostgreSQL    │
                    │   (SSL/TLS)     │
                    └─────────────────┘
```

---

## Pre-Deployment Checklist

### Repository Status
- [ ] All code committed to main branch
- [ ] No uncommitted changes
- [ ] All tests passing
- [ ] No console warnings/errors
- [ ] TypeScript strict mode passing
- [ ] Security vulnerabilities fixed (`npm audit`)
- [ ] Documentation complete

### Environment Variables
- [ ] `.env.example` files created (no secrets)
- [ ] Production environment variables documented
- [ ] Database connection string ready
- [ ] JWT secret generated (32+ characters)
- [ ] CORS origin configured
- [ ] API URL configured

### Backend
- [ ] All dependencies in package.json
- [ ] Build script configured
- [ ] Health check endpoint working
- [ ] Database migrations tested
- [ ] Seed data ready (if needed)
- [ ] Logging configured
- [ ] Error handling verified

### Frontend
- [ ] Build script configured
- [ ] API URL configured for production
- [ ] All environment variables set
- [ ] Build optimized
- [ ] No hardcoded API URLs
- [ ] No console logs in production code

### Database
- [ ] Schema designed and tested
- [ ] Indexes created
- [ ] Constraints enforced
- [ ] Migrations working
- [ ] Backup strategy defined
- [ ] Restore procedure tested

### Security
- [ ] HTTPS configured/ready
- [ ] Passwords hashed (bcryptjs)
- [ ] JWT secret stored as environment variable
- [ ] API keys not in code
- [ ] Rate limiting active
- [ ] Input validation comprehensive
- [ ] CORS properly configured
- [ ] Security headers active

### Monitoring
- [ ] Error tracking configured (optional)
- [ ] Logging strategy defined
- [ ] Performance metrics planned
- [ ] Alerts configured (optional)
- [ ] Uptime monitoring ready

---

## Step 1: Backend Deployment (Render)

### 1.1 Create Render Account

1. Visit [render.com](https://render.com)
2. Sign up with GitHub or email
3. Link GitHub repository
4. Authorize Render to access repositories

### 1.2 Create Web Service

**Steps:**
1. Dashboard → New → Web Service
2. Connect GitHub repository
3. Select branch: `main`
4. Name: `madrasa-accounting-api`
5. Environment: `Node`
6. Build Command: `npm install && npm run build`
7. Start Command: `npm start`

**Configuration:**
```
Runtime: Node 18
Build Command: npm install && npm run build
Start Command: npm start
Plan: Starter ($7/month) or higher
```

### 1.3 Configure Environment Variables

In Render Dashboard → Settings → Environment:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/madrasa

# JWT
JWT_SECRET=your-secure-random-32-char-string-here

# Server
NODE_ENV=production
PORT=3001

# CORS
CORS_ORIGIN=https://yourdomain.com

# Optional
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

**Generate Secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Configure Health Check

```
Add Route: GET /api/health
Check Interval: 30s
Timeout: 5s
Failure Threshold: 3
```

### 1.5 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Verify logs show no errors
4. Test health endpoint: `https://your-backend.onrender.com/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-08-22T00:00:00.000Z",
  "environment": "production"
}
```

### 1.6 Database Connection Test

```bash
# Test from your backend
curl https://your-backend.onrender.com/api/health
```

Should return `OK` with timestamp.

---

## Step 2: Database Setup (Supabase)

### 2.1 Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create organization
4. New Project:
   - Name: `madrasa-accounting`
   - Database password: Strong password
   - Region: Closest to users
   - Plan: Free or Pro

### 2.2 Get Connection String

1. Project Settings → Database
2. Copy connection string
3. Format: `postgresql://[user]:[password]@[host]:5432/[database]`

### 2.3 Run Database Migrations

```bash
# In your local project
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy

# Or with ts-node
npx ts-node node_modules/.bin/prisma migrate deploy
```

**Expected Output:**
```
✓ Done in 1.23s.
Migrated /database.sql
✓ All migrations have been applied successfully
```

### 2.4 Seed Database (Optional)

```bash
export DATABASE_URL="postgresql://..."
npx ts-node src/seed.ts
```

**Expected Output:**
```
✅ Seeding completed!
- Admin user created: admin@madrasa.local
```

### 2.5 Configure SSL/TLS

In Supabase → Project Settings → Database:
- SSL Mode: `require` (production)
- Connection String includes: `?sslmode=require`

### 2.6 Database Backups

**Automatic:**
- Supabase provides daily backups
- Retention: 7 days (free), 30 days (pro)
- Location: Secure cloud storage

**Manual Backup:**
```bash
# Backup database
pg_dump postgresql://[url] > backup.sql

# Restore database
psql postgresql://[url] < backup.sql
```

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize GitHub integration
4. Grant repository access

### 3.2 Deploy Frontend

1. Dashboard → New Project
2. Import GitHub repository
3. Select `frontend` directory (if monorepo)
4. Configure build settings:

**Build Configuration:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Environment Variables

Add in Vercel → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.onrender.com
NODE_ENV=production
```

### 3.4 Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Follow DNS instructions
4. HTTPS automatically configured by Vercel

### 3.5 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Verify logs show no errors
4. Test frontend: `https://yourdomain.vercel.app` or custom domain

**Test Checklist:**
- [ ] Pages load without errors
- [ ] API calls reach backend
- [ ] Login works
- [ ] Income/Expense operations work
- [ ] Reports generate
- [ ] Responsive design works
- [ ] Dark mode works (if implemented)

---

## Step 4: CI/CD Pipeline (GitHub Actions)

### 4.1 Create GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: madrasa_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies (Backend)
        run: cd backend && npm install

      - name: Build backend
        run: cd backend && npm run build

      - name: Run backend tests
        run: cd backend && npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/madrasa_test

      - name: Install dependencies (Frontend)
        run: cd frontend && npm install

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Run frontend tests
        run: cd frontend && npm test -- --coverage

      - name: Check TypeScript
        run: |
          cd backend && npx tsc --noEmit
          cd ../frontend && npx tsc --noEmit

      - name: Security audit
        run: |
          cd backend && npm audit --audit-level=moderate || true
          cd ../frontend && npm audit --audit-level=moderate || true

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Render (automatic)
        run: echo "Render auto-deploys on git push"

      - name: Deploy to Vercel (automatic)
        run: echo "Vercel auto-deploys on git push"
```

### 4.2 Enable Auto-Deploy

**Render:**
1. Settings → Deploy Hook
2. GitHub Automatic Deploy: Enabled
3. Deploys on `main` branch push

**Vercel:**
1. Settings → Git
2. Production Branch: `main`
3. Preview Deployments: Auto-enabled

---

## Step 5: Monitoring & Alerts

### 5.1 Error Tracking (Optional: Sentry)

```bash
# Install Sentry SDK
npm install @sentry/node @sentry/tracing

# Backend setup
import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### 5.2 Logging

**Vercel Logs:**
- Automatic log aggregation
- 1 month retention (pro plan)
- Searchable logs in dashboard

**Render Logs:**
- Real-time logs in dashboard
- Scroll to see deployment logs
- Search by keyword

**Supabase Logs:**
- Database connection logs
- Query logs (optional)
- Performance metrics

### 5.3 Uptime Monitoring

**Simple Uptime Check:**
```bash
# Cron job (every 5 minutes)
curl -X GET https://yourdomain.com/api/health \
  || send_alert "API is down"
```

**Services (Optional):**
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://www.pingdom.com) - Paid
- [StatusPage.io](https://www.statuspage.io) - Team alerts

---

## Step 6: Final Verification

### 6.1 Production Checklist

**Frontend:**
- [ ] Pages load in < 3 seconds
- [ ] All API calls work
- [ ] Login/logout functional
- [ ] CRUD operations work
- [ ] Reports generate
- [ ] Charts render correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode works
- [ ] No console errors
- [ ] No hardcoded URLs
- [ ] HTTPS enabled
- [ ] Custom domain working

**Backend:**
- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] Authentication functional
- [ ] All endpoints tested
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Error messages safe
- [ ] Logging working
- [ ] HTTPS enforced
- [ ] CORS configured correctly

**Database:**
- [ ] All tables created
- [ ] Indexes present
- [ ] Constraints enforced
- [ ] Data integrity verified
- [ ] Backups running
- [ ] SSL/TLS enabled
- [ ] User permissions limited
- [ ] Restore tested

**Security:**
- [ ] No hardcoded secrets
- [ ] Environment variables set
- [ ] HTTPS everywhere
- [ ] Security headers active
- [ ] Rate limiting enforced
- [ ] Input validation comprehensive
- [ ] Authentication working
- [ ] Audit logging functional

### 6.2 Load Testing

**Test with Production Data:**
```bash
# Generate test data
npm run test:data

# Run performance tests
npm run test:performance

# Expected results:
# Dashboard: < 500ms
# APIs: < 200ms
# Reports: < 2000ms
```

### 6.3 User Acceptance Testing

**Test Scenarios:**
1. [ ] Admin login with correct credentials
2. [ ] Admin login fails with wrong password
3. [ ] Add income transaction
4. [ ] Add expense transaction
5. [ ] View Day Book
6. [ ] View Ledger
7. [ ] Generate monthly report
8. [ ] Generate yearly report
9. [ ] View Balance Sheet
10. [ ] Check audit log
11. [ ] Update settings
12. [ ] Logout

---

## Step 7: Post-Deployment

### 7.1 Documentation

**Create:**
- [ ] README.md with quick start
- [ ] API documentation
- [ ] Database documentation
- [ ] Deployment guide
- [ ] Admin user guide
- [ ] Troubleshooting guide

### 7.2 Communication

**Notify:**
- [ ] End users (admin)
- [ ] IT team
- [ ] Support team
- [ ] Management
- [ ] Documentation team

### 7.3 Monitoring Week 1

**Daily Tasks:**
1. Check error logs
2. Verify uptime
3. Monitor performance
4. Review user feedback
5. Check database backups

**Metrics to Track:**
- Page load time
- API response time
- Error rate
- User logins
- Transactions created
- Reports generated

### 7.4 Optimization Opportunities

**After 1 Week:**
- [ ] Review slow queries
- [ ] Identify bottlenecks
- [ ] Optimize database
- [ ] Implement caching (optional)
- [ ] Review user feedback

---

## Troubleshooting

### Frontend Won't Load

**Problem:** 404 or blank page

**Solutions:**
1. Check Vercel build logs
2. Verify `VITE_API_URL` environment variable
3. Check browser console for errors
4. Verify API endpoint URL is correct

### API Returns 502 Bad Gateway

**Problem:** Backend not responding

**Solutions:**
1. Check Render logs for build errors
2. Verify database connection string
3. Check environment variables set
4. Test health endpoint manually
5. Restart service in Render dashboard

### Database Connection Fails

**Problem:** Cannot connect to Supabase

**Solutions:**
1. Verify DATABASE_URL format
2. Check SSL/TLS is enabled
3. Verify IP whitelist
4. Test with psql client locally
5. Check Supabase status page

### CORS Error

**Problem:** Frontend can't reach API

**Solutions:**
1. Verify CORS_ORIGIN matches frontend URL
2. Check CORS middleware is enabled
3. Verify no typos in environment variable
4. Restart backend service
5. Clear browser cache

### Slow Performance

**Problem:** Pages loading slowly

**Solutions:**
1. Check Render performance metrics
2. Review slow API endpoints in logs
3. Optimize database queries
4. Add missing indexes
5. Implement caching
6. Check frontend bundle size

---

## Maintenance Procedures

### Daily
- [ ] Monitor error logs
- [ ] Verify uptime
- [ ] Check backups running

### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies (optional)
- [ ] Test backup restore
- [ ] Review user feedback
- [ ] Check security logs

### Monthly
- [ ] Rotate JWT secret (optional)
- [ ] Security audit
- [ ] Performance review
- [ ] Database maintenance
- [ ] Update documentation

### Quarterly
- [ ] Full security review
- [ ] Penetration testing
- [ ] Database optimization
- [ ] Feature planning
- [ ] Compliance check

---

## Cost Estimation

### Monthly Costs (Production)

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Render | Starter | $7 | Backend server |
| Vercel | Pro | $20 | Frontend hosting |
| Supabase | Pro | $25 | Database (100GB) |
| **Total** | | **$52** | Per month |

**Note:** Costs may vary based on usage. Starter plans available for lower volume.

---

## Disaster Recovery

### Backup Strategy

**Frequency:** Daily automatic (Supabase)
**Retention:** 7 days (free), 30 days (pro)
**Manual:** Can backup anytime

**Restore Procedure:**
```bash
# From Supabase dashboard
1. Settings → Backups
2. Select backup date
3. Click "Restore"
4. Confirm operation
5. Wait for restore (5-15 minutes)
```

### Failover Strategy

**Database Down:**
1. Restore from backup
2. Verify data integrity
3. Test connections
4. Notify users

**Backend Down:**
1. Check error logs
2. Restart service in Render
3. Verify health check
4. Test endpoints
5. Notify users

**Frontend Down:**
1. Check Vercel build
2. Redeploy if necessary
3. Verify CDN cache
4. Clear browser cache

---

## Security Recommendations

### Pre-Production
- [ ] Change default admin password
- [ ] Verify all secrets in environment variables
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable audit logging

### Post-Production
- [ ] Monitor error logs for vulnerabilities
- [ ] Review access logs
- [ ] Keep dependencies updated
- [ ] Rotate secrets monthly
- [ ] Monitor for suspicious activity
- [ ] Test backup restoration regularly

---

## Support & Updates

### Getting Help
- **Render Support:** [render.com/support](https://render.com/support)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

### Keeping Updated
- [ ] Subscribe to security advisories
- [ ] Update dependencies monthly
- [ ] Monitor for breaking changes
- [ ] Review release notes
- [ ] Plan major version upgrades

---

## Success Criteria

✅ **Production Deployment Complete When:**
1. Frontend loads without errors
2. API endpoints respond correctly
3. Database has active connection
4. User can log in and use application
5. Transactions persist in database
6. Reports generate correctly
7. Backups running automatically
8. Monitoring active
9. Error logs clean
10. Performance metrics acceptable

---

**Status:** Ready for production deployment
**Last Updated:** 2026-08-22

This is the final step! Your Madrasa Accounting Software is ready to serve real users! 🎉
