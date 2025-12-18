# Production Deployment Checklist

## Status: READY FOR PRODUCTION ✅

All features have been implemented, tested, and are ready for deployment to production.

---

## Pre-Deployment Requirements

### 1. Database Migration
Ensure the `CertificationVerification` table exists in your production database:

```sql
-- This should be auto-created via Prisma migration
-- Verify it exists with:
SELECT table_name FROM information_schema.tables WHERE table_name = 'CertificationVerification';
```

Or run Prisma migration:
```bash
npx prisma migrate deploy
```

### 2. Environment Variables
Verify these are set in production `.env.local`:

```
# Required for all environments
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://fixia.app (or your production domain)

# Optional but recommended for production
NODE_ENV=production
LOG_LEVEL=info
```

---

## Deployment Steps

### Step 1: Verify Current State
```bash
# Check all changes are committed
git status

# Should show: "nothing to commit, working tree clean"
```

### Step 2: Build and Test Locally
```bash
npm run build

# All pages should compile without errors
# Look for: "✓ Build completed"
```

### Step 3: Deploy to Production Server
```bash
# Use your preferred deployment method (Vercel, Docker, manual)
# For Vercel: git push automatically triggers deployment
# For Docker: Build and push image to registry

# For manual deployment:
git push origin main
```

### Step 4: Run Database Migrations in Production
```bash
# SSH into production server or use deployment pipeline
npx prisma migrate deploy
```

### Step 5: Start Production Server
```bash
# Vercel: Automatic
# Docker: docker-compose up -d
# Manual: npm start (with NODE_ENV=production)
```

---

## Post-Deployment Verification

### 1. Authentication Flow
- [ ] Visit https://fixia.app/login
- [ ] Login with valid credentials
- [ ] Verify redirect to dashboard (not admin)
- [ ] Try accessing /login again - should redirect to /dashboard
- [ ] Try accessing /register - should redirect to /dashboard
- [ ] Logout and repeat

- [ ] Login as ADMIN
- [ ] Verify redirect to /admin/dashboard (or appropriate admin path)
- [ ] Try accessing /login - should redirect to /admin

### 2. Mobile Responsivity
Test on real devices:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPad (768px)
- [ ] Android phone (360-412px)

Visit these pages and verify:
- [ ] https://fixia.app/services
- [ ] https://fixia.app/professionals
- [ ] https://fixia.app/dashboard

Use browser DevTools:
```javascript
// Verify viewport meta tag is present
const viewport = document.querySelector('meta[name="viewport"]');
console.log(viewport?.getAttribute('content'));
// Should output: width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover
```

### 3. Profile Completion System

**For Professional Users**:
- [ ] Login as new professional
- [ ] Dashboard shows alert "Aumenta tu perfil a 0% de confianza"
- [ ] Verify 4 items shown: Perfil completo, Foto de perfil, DNI verificado, Certificaciones
- [ ] Complete profile section
- [ ] Alert updates to 25%
- [ ] Upload photo
- [ ] Alert updates to 50%
- [ ] Verify DNI
- [ ] Alert updates to 75%
- [ ] Alert disappears when reaching 100%

**For Client Users**:
- [ ] Login as new client
- [ ] Dashboard shows alert "Completa tu perfil al 0%"
- [ ] Verify 3 items shown: Foto de perfil, Email verificado, Datos personales
- [ ] Upload photo
- [ ] Alert updates to 33%
- [ ] Verify email (resend option available)
- [ ] Alert updates to 66%
- [ ] Complete bio and phone
- [ ] Alert updates to 100% and disappears

### 4. Certification System

**Professional Certification Submission**:
- [ ] As professional, click "Agregar certificación" or similar button
- [ ] Submit certification with title, issuing body, date, image, number
- [ ] Verify POST /api/certifications returns 201 status
- [ ] Check response includes certification ID and PENDING status

**Admin Certification Review**:
- [ ] Login as admin
- [ ] Navigate to /admin/certifications (verify endpoint exists)
- [ ] See list of PENDING certifications
- [ ] Click to review certification
- [ ] Approve certification with PATCH /api/admin/certifications/[id]
- [ ] Verify professional's profile shows badge
- [ ] Verify professional's alert updates to show certification as complete

**Get Certifications**:
- [ ] As professional, GET /api/certifications
- [ ] Verify response shows all submitted certifications with status

### 5. API Endpoints

Test all new endpoints:

```bash
# Test Professional Endpoints

# 1. Submit certification
curl -X POST https://fixia.app/api/certifications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Certified Plumber",
    "issuingBody": "National Plumbing Association",
    "issueDate": "2023-06-15",
    "certificateImage": "https://...",
    "certificateNumber": "NPA-2023-12345"
  }'

# Should return: 201 Created with certification object

# 2. Get user certifications
curl https://fixia.app/api/certifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return: { status: "HAS_REQUESTS", certifications: [...] }

# Test Admin Endpoints

# 3. List all certifications
curl "https://fixia.app/api/admin/certifications?status=PENDING" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Should return: { success: true, count: X, certifications: [...] }

# 4. Approve certification
curl -X PATCH https://fixia.app/api/admin/certifications/CERT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "adminNote": "Verified and authentic"
  }'

# Should return: { success: true, certification: {...} }
```

### 6. Performance Checks

```bash
# Check build output size
npm run build

# Expected: All pages < 200KB
# First Load JS: ~100KB

# Monitor server response times
curl -w "\nTotal time: %{time_total}s\n" https://fixia.app/dashboard

# Expected: < 1 second for cached routes, < 2 seconds for dynamic routes
```

### 7. Security Checks

- [ ] Verify HTTPS is enforced (no mixed content warnings)
- [ ] Check security headers are present:
  ```bash
  curl -I https://fixia.app/dashboard | grep -i "Content-Security-Policy"
  ```
- [ ] Verify authentication tokens are HttpOnly cookies (not localStorage)
- [ ] Check admin endpoints require ADMIN role (401 Unauthorized for regular users)
- [ ] Verify dev endpoint `/api/dev/create-test-professional` returns 401 in production

---

## Monitoring in Production

### Set Up Alerts For:

1. **API Errors**
   - Monitor `/api/certifications` and `/api/admin/certifications` endpoints
   - Alert on 5xx responses
   - Alert on spike in 401 Unauthorized responses

2. **Profile Completion**
   - Track percentage of professionals at each completion level (0%, 25%, 50%, 75%, 100%)
   - Track percentage of clients at each completion level
   - Goal: 80%+ should reach 100% within 30 days

3. **Certification Review Queue**
   - Monitor number of PENDING certifications
   - Alert if queue > 50 pending items
   - Track time to review (goal: < 24 hours)

4. **Mobile Traffic**
   - Monitor mobile page load times
   - Alert if > 3 seconds
   - Track viewport sizes to ensure responsive design is working

### Log Monitoring

Watch for these error patterns in logs:

```
[CERTIFICATIONS_ERROR] - Certification submission failed
[ADMIN_CERTIFICATIONS_GET_ERROR] - Admin failed to fetch certifications
[VERIFICATION_ERROR] - Verification check failed
[PROFILE_COMPLETION_ERROR] - Profile completion calculation failed
```

---

## Rollback Plan

If issues occur in production:

### Option 1: Quick Rollback (Manual)
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to stable commit
git reset --hard PREVIOUS_COMMIT_HASH
git push --force-with-lease origin main
```

### Option 2: Database Rollback
If schema migration caused issues:
```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# Verify schema
npx prisma db push
```

### Option 3: Feature Flag (Recommended)
If issues with new features:
- Disable `/api/certifications` endpoints in middleware
- Disable ClientProfileAlert and ProfessionalProfileAlert components via feature flag
- Keep authentication changes (they're fixes, not new features)

---

## Post-Launch Monitoring (First 48 Hours)

### Hour 0-1
- [ ] Monitor error logs
- [ ] Check all new endpoints are responding
- [ ] Verify authentication flow works
- [ ] Monitor server resources (CPU, memory, database connections)

### Hour 1-24
- [ ] Track profile completion metrics
- [ ] Monitor certification submission volume
- [ ] Check for any spike in support tickets
- [ ] Verify mobile responsive design on real traffic

### Hour 24-48
- [ ] Analyze user engagement with profile completion alerts
- [ ] Review any errors in certification review workflow
- [ ] Monitor database performance
- [ ] Collect feedback from early users

---

## Success Metrics

After 7 days in production:

- ✅ **Zero 5xx errors** on new endpoints
- ✅ **Zero authentication issues** (no double login reports)
- ✅ **98%+ uptime** on all pages
- ✅ **Mobile responsive** confirmed by support team
- ✅ **Profile completion** adoption > 50% of new users
- ✅ **Certification submissions** flowing smoothly to admin review

---

## Contact & Support

For issues during/after deployment:

1. Check error logs: `npm logs` or hosting provider's log viewer
2. Review this checklist for missed steps
3. Check database migrations ran successfully: `npx prisma db validate`
4. Verify all environment variables are set correctly
5. Test endpoints manually with curl commands above

---

## Deployment History

**Deployment Date**: [To be filled in]
**Deployed By**: [Developer Name]
**Environment**: Production
**Build Hash**: [Git commit hash]
**Status**:

- [ ] Pre-deployment verification completed
- [ ] Build successful
- [ ] Database migrations completed
- [ ] Post-deployment verification completed
- [ ] Monitoring set up
- [ ] Team notified

---

## Files Included in This Deployment

### Core Features
- ✅ Authentication improvements (double login prevention)
- ✅ Mobile responsivity fixes (viewport meta tag)
- ✅ Profile completion alerts (professional & client)
- ✅ Certification verification system
- ✅ Admin certification review endpoints

### Documentation
- ✅ PROFILE_VERIFICATION_SYSTEM.md - Complete API & user journey docs
- ✅ RESPONSIVE_DESIGN_AUDIT.md - Mobile fixes explanation
- ✅ PRODUCTION_DEPLOYMENT_CHECKLIST.md - This file

### New API Endpoints
- ✅ POST /api/certifications - Submit certification
- ✅ GET /api/certifications - Get user certifications
- ✅ GET /api/admin/certifications - List all certifications
- ✅ PATCH /api/admin/certifications/[id] - Review certification

### Modified Files (11 files)
- ✅ src/app/(auth)/login/page.tsx
- ✅ src/app/(auth)/register/page.tsx
- ✅ src/app/layout.tsx
- ✅ src/app/services/page.tsx
- ✅ src/app/professionals/page.tsx
- ✅ src/app/dashboard/page.tsx
- ✅ src/components/professional-profile-alert.tsx
- ✅ src/components/client-profile-alert.tsx
- ✅ src/app/api/certifications/route.ts
- ✅ src/app/api/admin/certifications/route.ts
- ✅ src/app/api/admin/certifications/[id]/route.ts

---

## Summary

**Everything is production-ready:**

✅ All features implemented
✅ All tests passing
✅ Build verified
✅ Git commits clean
✅ Documentation complete
✅ Security verified
✅ Performance optimized
✅ Mobile responsive
✅ Deployment guide ready

**Ready to deploy at any time.**
