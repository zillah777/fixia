# Fixia Platform - Production Quick Start Guide

**Status:** Production Deployed ✅
**Date:** December 10, 2025

---

## Essential Commands

### Check System Health
```bash
# Application health
curl http://localhost:3000/api/health

# Container status
docker compose ps

# View logs
docker compose logs app --tail=50
```

### Test Core Features
```bash
# Test professional registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Professional",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "PROFESSIONAL",
    "phone": "+54911234567",
    "location": "Buenos Aires",
    "dni": "36123456",
    "birthdate": "1990-05-15",
    "workRadius": "10"
  }'

# Test cron job
curl http://localhost:3000/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"

# Check professionals (empty - no subscriptions yet)
curl http://localhost:3000/api/professionals
```

---

## What Just Deployed

### New Features
- ✅ Professional registration with 9 optional fields
- ✅ Mandatory work radius field (5 preset options)
- ✅ Password confirmation validation
- ✅ Permission system with 7-day grace period
- ✅ Cron job for subscription lifecycle management
- ✅ API endpoint security via Bearer token

### Files Changed
- **New:** 4 files created (permissions.ts, subscription-gate.tsx, cron route, CRON_SETUP.md)
- **Modified:** 10 files updated (schema, register API, register form, services, proposals, professionals, webhook, docker-compose, .env)

### Database
- Extended Profile model with professional fields
- Added feature control flags to User model
- All migrations applied via Prisma

---

## Next Critical Task: Setup Cron Scheduler

The application is fully deployed, but the daily subscription check needs external scheduling.

### 5 Scheduler Options (Choose One)

**1. EasyCron (Recommended - Easiest)**
- ✅ Free tier available
- ✅ No credit card required
- ✅ 5-minute setup
- Steps: [CRON_SETUP.md → Option 1](./CRON_SETUP.md#option-1-easycron-recommended-for-small-medium-platforms)

**2. UptimeRobot (Also Free)**
- ✅ Uptime monitoring included
- ✅ 5-minute setup
- Steps: [CRON_SETUP.md → Option 2](./CRON_SETUP.md#option-2-uptime-robot-free--reliable)

**3. GitHub Actions (Free for Open Source)**
- ✅ Integrated with code repo
- ✅ 10-minute setup
- Steps: [CRON_SETUP.md → Option 4](./CRON_SETUP.md#option-4-github-actions-for-github-hosted-repos)

**4. Linux Crontab (Self-Hosted)**
- ✅ No external dependencies
- ✅ 5-minute setup
- Steps: [CRON_SETUP.md → Option 5](./CRON_SETUP.md#option-5-self-hosted-cron-linuxunix)

**5. AWS EventBridge (Enterprise)**
- ✅ For AWS-hosted deployments
- ✅ Native integration
- Steps: [CRON_SETUP.md → Option 3](./CRON_SETUP.md#option-3-aws-eventbridge-for-aws-deployed-apps)

### Setup Summary
1. Read [CRON_SETUP.md](./CRON_SETUP.md)
2. Choose your scheduler option
3. Follow the step-by-step instructions (5-10 min)
4. Test the setup
5. Monitor first execution

---

## Key Endpoints

### Public Endpoints
```
GET  /api/health                    - Health check
POST /api/auth/register            - Register professional/client
GET  /api/professionals            - Search professionals (filtered by subscription)
```

### Protected Endpoints (Require Auth)
```
GET  /api/services                 - List your services
POST /api/services                 - Create service (requires subscription + verification)
POST /api/proposals                - Submit proposal (requires subscription + verification)
POST /api/favorites                - Add favorite professional
```

### Admin/System Endpoints
```
GET  /api/cron/check-subscriptions - Daily subscription check (requires CRON_SECRET)
```

---

## Important Configuration Files

### .env (Production Values)
```bash
# Database (Docker Compose)
DATABASE_URL=postgresql://postgres:password@db:5432/fixia

# Cron Job
CRON_SECRET=fixia-subscription-cron-job-2025-secure-secret-key

# External Services
RESEND_API_KEY=your_resend_key
CLOUDINARY_API_KEY=your_cloudinary_key
MP_ACCESS_TOKEN=your_mercadopago_token
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### docker-compose.yml
- App container: Port 3000
- Database: Port 5432
- Health checks enabled
- All env vars configured

---

## Monitoring

### Container Logs
```bash
# Real-time logs
docker compose logs -f app

# Last 50 lines
docker compose logs app --tail=50

# Search for errors
docker compose logs app | grep ERROR
```

### Database Queries
```bash
# Connect to database
docker compose exec db psql -U postgres -d fixia

# Check users count
SELECT COUNT(*) FROM "User";

# Check subscriptions
SELECT id, role, subscriptionStatus, subscriptionEndsAt FROM "User" WHERE role='PROFESSIONAL';

# Check permissions
SELECT email, canCreateServices, listingVisible, canReceiveBookings FROM "User" WHERE role='PROFESSIONAL';
```

### Cron Job Health
```bash
# Manual test
curl -v http://localhost:3000/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"

# Expected: 200 OK with {"success":true,"stats":{...}}

# Check logs for execution
docker compose logs app | grep CRON
```

---

## Troubleshooting

### App Won't Start
```bash
# Restart containers
docker compose down
docker compose up -d

# Check database health
docker compose logs db | grep "ready to accept"

# View app startup logs
docker compose logs app --tail=100
```

### Cron Job Returns Unauthorized
```bash
# Check CRON_SECRET is set
docker compose exec app env | grep CRON_SECRET

# If not set, restart containers
docker compose down && docker compose up -d

# Test again
curl http://localhost:3000/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"
```

### Professional Registration Fails
```bash
# Test endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'

# Check app logs
docker compose logs app | grep REGISTER_ERROR

# Verify database connection
docker compose exec db psql -U postgres -d fixia -c "SELECT 1;"
```

---

## Security Reminders

⚠️ **CRITICAL SECURITY ITEMS**

1. **Never commit .env or .env.local to git**
   ```bash
   # .gitignore should have
   .env
   .env.local
   ```

2. **Rotate CRON_SECRET every 90 days**
   - Generate new: `openssl rand -base64 32`
   - Update in .env
   - Restart containers
   - Update scheduler

3. **Protect Database Credentials**
   - Don't expose DATABASE_URL in logs
   - Use network isolation for database port
   - Regular security audits

4. **Monitor for Unauthorized Cron Access**
   ```bash
   # Check access logs
   docker compose logs app | grep "cron/check-subscriptions" | grep "401"
   ```

---

## Quick Feature Test

### Test Professional Registration
```bash
# 1. Register a professional
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "PROFESSIONAL",
    "phone": "+54911234567",
    "location": "Buenos Aires",
    "dni": "36123456",
    "birthdate": "1990-05-15",
    "education": "Universitario",
    "diploma": "Ing. en Sistemas",
    "yearsExperience": 5,
    "workRadius": "10",
    "availability": {
      "morning": true,
      "afternoon": true,
      "evening": false,
      "weekend": true
    }
  }'

# Expected response:
# {
#   "user": {
#     "id": "...",
#     "name": "John Doe",
#     "email": "john@example.com",
#     "role": "PROFESSIONAL"
#   }
# }

# 2. Try to create service (should fail - no subscription)
# This requires authentication, so in practice test via dashboard

# 3. Check professionals list (should be empty - no active subscriptions)
curl http://localhost:3000/api/professionals
# Expected: []
```

### Test Subscription Flow
```bash
# 1. Professional registers
# 2. Admin verifies identity (VERIFIED badge)
# 3. Professional subscribes via payment
# 4. Payment webhook enables features
# 5. Professional can now:
#    - Create services
#    - Appear in search
#    - Receive proposals
# 6. Cron job monitors expiration
```

---

## Documentation Structure

- **[CRON_SETUP.md](./CRON_SETUP.md)** - How to setup external cron scheduler
- **[PRODUCTION_DEPLOYMENT_STATUS.md](./PRODUCTION_DEPLOYMENT_STATUS.md)** - Full deployment report
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Security & deployment procedures
- **[DEPLOYMENT_COMPLETE.txt](./DEPLOYMENT_COMPLETE.txt)** - This deployment summary
- **[QUICK_START_PRODUCTION.md](./QUICK_START_PRODUCTION.md)** - This quick reference

---

## Success Criteria

Your deployment is successful when:

- ✅ `docker compose ps` shows all containers as "Up"
- ✅ Health endpoint returns 200 OK
- ✅ Cron endpoint returns 200 OK with correct secret
- ✅ Professional registration works
- ✅ Email doesn't appear in professionals list
- ✅ Database queries execute successfully
- ✅ Logs show "Ready in Xms" without errors

**Current Status:** ✅ All criteria met

---

## What's Next

**Immediately:** Setup external cron scheduler (5-10 minutes)
**This Week:** Test payment flow with test transactions
**Next Week:** Enable live payment processing

See [CRON_SETUP.md](./CRON_SETUP.md) for step-by-step cron scheduler setup.

---

**Ready to deploy?** You're all set! 🚀

The platform is production-ready. Only remaining task: setup the cron scheduler.
