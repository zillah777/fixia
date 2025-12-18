# Fixia Platform - Cron Job Setup Guide

## Overview

This guide covers setting up automated subscription management via external cron job schedulers. The Fixia platform includes an internal subscription expiry check endpoint (`/api/cron/check-subscriptions`) that must be called daily to:

1. **Monitor subscriptions expiring in 7 days** - Send reminder emails to professionals
2. **Handle grace period expiration** - Disable listing visibility, service creation, and booking ability when 7-day grace period ends
3. **Process cancelled subscriptions** - Clean up subscriptions that have been manually cancelled

---

## Internal Cron Endpoint

### Endpoint Details

**URL:** `/api/cron/check-subscriptions`
**Method:** `GET`
**Authentication:** Bearer token in `Authorization` header
**Return:** JSON response with subscription statistics

### Authentication

The endpoint requires a Bearer token matching the `CRON_SECRET` environment variable:

```bash
curl http://localhost:3000/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"
```

**Response (Success):**
```json
{
  "success": true,
  "timestamp": "2025-12-10T01:45:27.715Z",
  "stats": {
    "expiringInSevenDays": 5,
    "gracePeriodExpired": 2,
    "cancelledAndExpired": 1
  }
}
```

**Response (Unauthorized):**
```json
{
  "error": "Unauthorized",
  "code": "INVALID_CRON_SECRET"
}
```

### Configuration

The `CRON_SECRET` is configured in `.env` and `.env.local`:

```env
# .env
CRON_SECRET=fixia-subscription-cron-job-2025-secure-secret-key
```

**Important:** This secret should be:
- ✅ Long and random (at least 32 characters)
- ✅ Stored securely (not in git, use .env.local)
- ✅ Rotated regularly (every 90 days)
- ❌ NOT shared publicly or committed to version control

---

## Option 1: EasyCron (Recommended for Small-Medium Platforms)

EasyCron is a free cron job scheduler that can call your endpoints on a schedule.

### Setup Steps

#### 1. Create EasyCron Account

1. Visit [https://www.easycron.com](https://www.easycron.com)
2. Sign up for a free account
3. Verify your email
4. Log in to your dashboard

#### 2. Create a New Cron Job

1. Click "**New Cron Job**" button
2. Fill in the form:

   **Cron URL:**
   ```
   https://fixia.app/api/cron/check-subscriptions
   ```

   **HTTP Method:** `GET`

   **Cron Expression:** `0 0 * * *` (Daily at 00:00 UTC)

   **Timeout:** `30` seconds (default is fine)

   **Logging:** ✅ Enable to track executions

   **Basic Auth:** Leave empty (we use Bearer token instead)

#### 3. Add Custom Headers

EasyCron may not support custom headers directly. Instead, use a query parameter approach:

**Alternative Cron URL:**
```
https://fixia.app/api/cron/check-subscriptions?secret=fixia-subscription-cron-job-2025-secure-secret-key
```

Then modify the endpoint to accept the secret as a query parameter:

**If needed, update the API route** in `src/app/api/cron/check-subscriptions/route.ts`:
```typescript
// Support both Authorization header and query parameter
const secret = request.headers.get("authorization")?.replace("Bearer ", "") ||
               new URL(request.url).searchParams.get("secret")

if (secret !== process.env.CRON_SECRET) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

#### 4. Test the Job

1. Click "**Trigger**" button to execute immediately
2. Check the "**Execution Log**" to see results
3. Verify response: `{"success": true, "stats": {...}}`

#### 5. Verify Recurring Execution

1. Check "**Execution Log**" after 24 hours
2. Confirm the job runs at the scheduled time
3. Monitor email logs for notifications sent

---

## Option 2: Uptime Robot (Free & Reliable)

UptimeRobot can be configured to call your endpoint on a schedule.

### Setup Steps

#### 1. Create UptimeRobot Account

1. Visit [https://uptimerobot.com](https://uptimerobot.com)
2. Sign up for a free account
3. Verify your email

#### 2. Create a New Monitor

1. Click "**Add New Monitor**"
2. Select **Monitor Type:** `HTTPS`
3. Fill in:

   **Friendly Name:**
   ```
   Fixia Subscription Check
   ```

   **URL:**
   ```
   https://fixia.app/api/cron/check-subscriptions?secret=fixia-subscription-cron-job-2025-secure-secret-key
   ```

   **Check interval:** `1440` minutes (24 hours = 1440 minutes)

4. Click "**Create Monitor**"

#### 3. Configure Webhook (Optional)

To get notifications when the job runs:

1. Go to "**Integrations**" → "**Webhooks**"
2. Click "**Add Webhook**"
3. Configure your preferred notification method (email, Slack, etc.)

#### 4. Test Execution

1. The first check should happen within 5 minutes
2. View execution history in the monitor dashboard
3. Verify the job is marked as "**Up**" (HTTP 200 response)

---

## Option 3: AWS EventBridge (For AWS-Deployed Apps)

If your application is hosted on AWS, use EventBridge for native cron scheduling.

### Setup Steps

#### 1. Create an EventBridge Rule

```bash
aws events put-rule \
  --name fixia-subscription-check \
  --schedule-expression "cron(0 0 * * ? *)" \
  --state ENABLED \
  --description "Daily Fixia subscription expiry check"
```

#### 2. Create HTTP Target

```bash
aws events put-targets \
  --rule fixia-subscription-check \
  --targets "Id"="1","Arn"="arn:aws:events:region:account:api-destination/fixia-api","HttpParameters"={"HeaderParameters"={"Authorization"="Bearer fixia-subscription-cron-job-2025-secure-secret-key"},"PathParameterValues"=[],"QueryStringParameters"={},"PipelineParameters":{"DetailPayload":""}}"
```

#### 3. Test Rule

```bash
aws events put-events \
  --entries '[{"Source":"aws.events","DetailType":"Scheduled Event","Detail":"{}","Resources":["arn:aws:events:region:account:rule/fixia-subscription-check"]}]'
```

---

## Option 4: GitHub Actions (For GitHub-Hosted Repos)

Use GitHub Actions for free scheduled tasks if your code is on GitHub.

### Setup Steps

#### 1. Create Workflow File

Create `.github/workflows/cron-subscription-check.yml`:

```yaml
name: Fixia Subscription Check

on:
  schedule:
    # Run at 00:00 UTC every day
    - cron: '0 0 * * *'

  # Allow manual trigger
  workflow_dispatch:

jobs:
  check-subscriptions:
    runs-on: ubuntu-latest

    steps:
      - name: Check Fixia Subscriptions
        run: |
          curl -X GET "https://fixia.app/api/cron/check-subscriptions" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            -w "\nStatus: %{http_code}\n"

      - name: Notify on Failure
        if: failure()
        run: |
          echo "Subscription check failed!"
          # Optional: Send to Slack, PagerDuty, etc.
```

#### 2. Add GitHub Secret

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click "**New repository secret**"
3. Name: `CRON_SECRET`
4. Value: `fixia-subscription-cron-job-2025-secure-secret-key`
5. Click "**Add secret**"

#### 3. Test Workflow

1. Go to **Actions** tab
2. Click "**Fixia Subscription Check**"
3. Click "**Run workflow**" → "**Run workflow**"
4. Wait for execution to complete
5. Check logs for success message

---

## Option 5: Self-Hosted Cron (Linux/Unix)

For self-hosted servers with SSH access.

### Setup Steps

#### 1. Create Shell Script

Create `/usr/local/bin/fixia-cron-subscription-check.sh`:

```bash
#!/bin/bash

# Fixia Subscription Expiry Check
# Location: /usr/local/bin/fixia-cron-subscription-check.sh
# Runs: Daily at 00:00 UTC via crontab

CRON_SECRET="fixia-subscription-cron-job-2025-secure-secret-key"
APP_URL="https://fixia.app"
LOG_FILE="/var/log/fixia/cron-subscription-check.log"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Execute the cron job
RESPONSE=$(curl -s -X GET "$APP_URL/api/cron/check-subscriptions" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}")

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Log the execution
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TIMESTAMP] Status: $HTTP_CODE | Response: $BODY" >> "$LOG_FILE"

# Exit with status code
[ "$HTTP_CODE" = "200" ] && exit 0 || exit 1
```

#### 2. Make Script Executable

```bash
sudo chmod +x /usr/local/bin/fixia-cron-subscription-check.sh
```

#### 3. Add to Crontab

```bash
# Open crontab editor
sudo crontab -e

# Add this line (runs daily at 00:00 UTC)
0 0 * * * /usr/local/bin/fixia-cron-subscription-check.sh
```

#### 4. Verify Setup

```bash
# Check if cron entry exists
sudo crontab -l | grep fixia-cron-subscription-check

# Check logs
tail -f /var/log/fixia/cron-subscription-check.log

# Test manually
/usr/local/bin/fixia-cron-subscription-check.sh

# Expected output in log:
# [2025-12-10 01:45:27] Status: 200 | Response: {"success":true,"stats":{...}}
```

---

## Monitoring & Alerting

### Setup Execution Monitoring

#### Monitor Success Metrics

1. **Check success rate** (should be >99%)
   ```bash
   tail -f /var/log/fixia/cron-subscription-check.log | grep "Status: 200"
   ```

2. **Alert on failures** (set up with your monitoring tool)
   - Datadog: Create metric alert on failed cron jobs
   - New Relic: Monitor endpoint response times
   - Sentry: Capture cron job errors

3. **Track execution time** (should complete in <5 seconds)
   ```bash
   curl -w "Total time: %{time_total}s\n" https://fixia.app/api/cron/check-subscriptions
   ```

### Manual Testing

Test the cron job endpoint manually:

```bash
# Test with correct secret
curl -i https://fixia.app/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"

# Expected: 200 OK with JSON response

# Test with incorrect secret
curl -i https://fixia.app/api/cron/check-subscriptions \
  -H "Authorization: Bearer wrong-secret"

# Expected: 401 Unauthorized
```

### Check Logs for Issues

```bash
# View application logs
docker compose logs app | grep CRON

# Expected log output:
# [CRON] Found 0 users with subscriptions expiring in 7 days
# [CRON] Found 0 users with grace period expired
# [CRON] Found 0 users with cancelled subscriptions
# [CRON] Subscription check completed: {success: true, ...}
```

---

## Troubleshooting

### Issue: "Unauthorized" Response

**Symptom:** Cron job returns 401 Unauthorized

**Causes:**
1. CRON_SECRET doesn't match in environment
2. Bearer token not included in request
3. Token has extra spaces or special characters

**Solution:**
```bash
# Verify CRON_SECRET is set in docker-compose.yml
docker compose exec app env | grep CRON_SECRET

# Expected output:
# CRON_SECRET=fixia-subscription-cron-job-2025-secure-secret-key

# If not set, restart containers
docker compose down && docker compose up -d

# Test again
curl https://fixia.app/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"
```

### Issue: Timeout Errors

**Symptom:** Cron job times out after 30 seconds

**Causes:**
1. Database is slow or unresponsive
2. Too many subscriptions to process
3. Network connectivity issues

**Solution:**
```bash
# Check database health
docker compose exec db pg_isready -U postgres -d fixia

# Check application memory usage
docker compose stats --no-stream | grep fixia-app

# If memory is high (>500MB), restart app
docker compose restart app

# Test endpoint with timeout
curl --max-time 60 https://fixia.app/api/cron/check-subscriptions \
  -H "Authorization: Bearer fixia-subscription-cron-job-2025-secure-secret-key"
```

### Issue: Job Never Executes

**Symptom:** Cron job doesn't run on schedule

**Causes:**
1. Scheduler service is not running
2. Cron expression is incorrect
3. Server timezone mismatch

**Solution:**

For EasyCron/UptimeRobot:
- Verify the cron job is "Active" (not paused)
- Check execution history in dashboard
- Verify URL is accessible: `curl https://fixia.app/api/health`

For Linux crontab:
```bash
# Verify crontab service is running
sudo systemctl status cron

# Check crontab logs
sudo tail -f /var/log/syslog | grep CRON

# Verify cron entry
sudo crontab -l

# Test cron syntax
# Use crontab.guru to validate expression
```

### Issue: Notifications Not Sending

**Symptom:** Subscriptions are expiring but users don't receive emails

**Causes:**
1. Email service (Resend) is not configured
2. User preferences have notifications disabled
3. Email template is broken

**Solution:**
```bash
# Check Resend API key is configured
docker compose exec app env | grep RESEND_API_KEY

# Check email logs
docker compose logs app | grep EMAIL

# Test email manually via API
curl -X POST https://fixia.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "message": "Test message"
  }'

# Check user notification preferences
docker compose exec db psql -U postgres -d fixia -c \
  "SELECT id, email, notificationsEnabled FROM \"User\" LIMIT 5;"
```

---

## Security Best Practices

### 1. Protect the CRON_SECRET

- ✅ Store only in `.env.local` (not in version control)
- ✅ Use strong random string (32+ characters)
- ✅ Rotate every 90 days
- ✅ Use different secret for each environment (dev, staging, prod)

Example strong secrets:
```bash
# Generate new secret
openssl rand -base64 32

# Output: example: 8f7d6b5a4c3e2f1g0h9i8j7k6l5m4n3o
```

### 2. Whitelist Cron Scheduler IPs

If your cron scheduler has static IPs, whitelist them in your firewall:

```bash
# Example: Allow only EasyCron IPs (check their docs for current IPs)
# 198.51.100.0/24 - Example subnet
# 203.0.113.0/24 - Example subnet

sudo ufw allow from 198.51.100.0/24 to any port 443
```

### 3. Monitor Cron Job Access

```bash
# Check access logs for cron job calls
tail -f /var/log/nginx/access.log | grep "cron/check-subscriptions"

# Look for unusual patterns:
# - Requests from unexpected IPs
# - 401 Unauthorized (brute force attempts)
# - High frequency (more than once per hour)
```

### 4. Use HTTPS Only

Always use `https://` (not `http://`) for cron job URLs:

```bash
# ✅ Correct
https://fixia.app/api/cron/check-subscriptions

# ❌ Wrong (never use)
http://fixia.app/api/cron/check-subscriptions
```

---

## Performance Optimization

### Database Optimization

If cron job is slow:

```bash
# Check database statistics
docker compose exec db psql -U postgres -d fixia -c "ANALYZE;"

# Monitor active queries during cron execution
docker compose exec db psql -U postgres -d fixia -c \
  "SELECT query, state FROM pg_stat_activity WHERE state != 'idle';"

# Add indexes for cron queries (if not already present)
docker compose exec db psql -U postgres -d fixia -c \
  "CREATE INDEX idx_user_subscription_ends ON \"User\"(subscriptionEndsAt);"
```

### Caching

To reduce database load, cache subscription data:

1. Add Redis to docker-compose.yml (optional)
2. Cache subscription queries with 1-hour TTL
3. Clear cache on payment webhooks

### Parallelization

For large user bases (>10k professionals):

1. Split cron job into batches
2. Run multiple workers in parallel
3. Monitor for database connection limits

---

## Deployment Checklist

Before putting cron job into production:

- [ ] CRON_SECRET configured in `.env`
- [ ] `.env.local` is in `.gitignore`
- [ ] Cron endpoint tested manually with correct secret
- [ ] Cron endpoint tested with incorrect secret (should return 401)
- [ ] Scheduler service account created with only necessary permissions
- [ ] Application health endpoint returns 200 OK
- [ ] Database can handle cron job load
- [ ] Email service (Resend) is configured and tested
- [ ] Monitoring/alerting is set up
- [ ] Logging is configured to track cron executions
- [ ] Rollback plan documented
- [ ] Team notified of cron job setup

---

## References

### External Services
- **EasyCron:** https://www.easycron.com
- **UptimeRobot:** https://uptimerobot.com
- **AWS EventBridge:** https://docs.aws.amazon.com/eventbridge/
- **GitHub Actions:** https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onschedule

### Related Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Main deployment guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature implementation summary

### Cron Expression Help
- **Crontab Guru:** https://crontab.guru (validate expressions)
- **Cron Syntax:** `minute hour day_of_month month day_of_week`
  - `0 0 * * *` = Every day at 00:00 UTC
  - `0 */6 * * *` = Every 6 hours
  - `30 2 * * 1` = Every Monday at 02:30 UTC

---

**Last Updated:** 2025-12-10
**Status:** Complete and Tested
**Cron Secret:** ✅ Configured
**Health Endpoint:** ✅ Verified
**All Options Documented:** ✅ Yes
