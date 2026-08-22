# Vercel Deployment Setup Guide

## ⚠️ Current Issue

The backend isn't running on Vercel because:
- ❌ Environment variables not configured
- ❌ Database connection not set up
- ❌ No seed data (no admin user)

---

## ✅ Step 1: Set Up Environment Variables on Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: `account-software-basic`
3. Click **Settings** → **Environment Variables**
4. Add these variables:

### Required Variables

```
DATABASE_URL = postgresql://user:password@host:port/database
```
Get this from your PostgreSQL provider (Supabase, AWS RDS, etc.)

```
JWT_SECRET = your-super-secret-jwt-key-change-this-in-production-12345
```

```
CORS_ORIGIN = https://account-software-basic.vercel.app
```
(Replace with your actual frontend URL)

```
NODE_ENV = production
```

```
PORT = 3000
```

### Optional Variables

```
BCRYPT_ROUNDS = 12
LOG_LEVEL = info
```

---

## ✅ Step 2: Deploy Backend

After setting environment variables:

```bash
# Option A: From local machine
cd backend
npm run build
vercel deploy --prod

# Option B: Via GitHub (Auto-deploy)
# Push changes to main branch
# Vercel will auto-deploy
```

---

## ✅ Step 3: Run Database Migrations

After deployment, run migrations on production database:

```bash
# From backend directory
DATABASE_URL="your_production_url" npx prisma migrate deploy
```

---

## ✅ Step 4: Create Admin User

You have two options:

### Option A: Via API Call (Recommended)

```bash
# Create user via registration endpoint
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "koofiya@admin.com",
    "username": "koofiya",
    "password": "Koofiya1234"
  }'
```

### Option B: Via Seed Script

Create `backend/scripts/createAdmin.ts`:

```typescript
import prisma from '../src/config/database';
import userService from '../src/services/userService';

async function createAdmin() {
  try {
    const user = await userService.createUser({
      email: 'koofiya@admin.com',
      username: 'koofiya',
      password: 'Koofiya1234',
    });
    console.log('✅ Admin user created:', user);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
```

Then run:
```bash
DATABASE_URL="your_url" npx ts-node scripts/createAdmin.ts
```

---

## ✅ Step 5: Update Frontend Environment Variables

Set in Vercel frontend project:

```
VITE_API_URL = https://your-backend.vercel.app/api
```

Or update the API configuration in `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'https://account-software-basic-gvjt.vercel.app/api';
```

---

## ✅ Step 6: Test the Deployment

```bash
# Test backend health
curl https://account-software-basic-gvjt.vercel.app/api/health

# Test login
curl -X POST https://account-software-basic-gvjt.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "koofiya@admin.com",
    "password": "Koofiya1234"
  }'
```

---

## 📋 Vercel Environment Variables Template

Copy and paste into Vercel Settings → Environment Variables:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
JWT_SECRET=your-super-secret-jwt-key-change-this-12345
CORS_ORIGIN=https://account-software-basic.vercel.app
NODE_ENV=production
PORT=3000
BCRYPT_ROUNDS=12
LOG_LEVEL=info
JWT_EXPIRE=24h
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## 🆘 Troubleshooting

### Backend Still Not Working?

1. **Check Vercel Logs**
   - Go to Vercel dashboard
   - Select project
   - Click "Deployments"
   - View build logs

2. **Check Environment Variables**
   ```bash
   # SSH into Vercel (if available)
   vercel env list
   ```

3. **Rebuild**
   ```bash
   vercel deploy --prod --force
   ```

### Database Connection Error?

- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs
- Test locally first: `DATABASE_URL="your_url" npm start`

### CORS Error?

- Update CORS_ORIGIN in Vercel environment
- Ensure it matches your frontend URL
- Redeploy after changing

---

## 📊 Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Backend deployed and running
- [ ] Database migrations applied
- [ ] Admin user created (koofiya@admin.com)
- [ ] Frontend pointing to correct backend URL
- [ ] Backend health endpoint working
- [ ] Login working with koofiya@admin.com
- [ ] Can view income/expenses

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- PostgreSQL Providers:
  - Supabase: https://supabase.com
  - AWS RDS: https://aws.amazon.com/rds/
  - Railway: https://railway.app
  - Render: https://render.com
- Prisma: https://prisma.io

---

## 🚀 Quick Start (For Supabase)

1. Create Supabase project at https://supabase.com
2. Get connection string from Project Settings → Database
3. Copy to Vercel as DATABASE_URL
4. Run `npx prisma migrate deploy`
5. Create admin user via script
6. Deploy frontend
7. Login with koofiya@admin.com / Koofiya1234

---

Done! 🎉 Your app should now be working on Vercel.
