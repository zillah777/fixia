# 🐳 FIXIA - DOCKER & CLOUDFLARE TUNNEL DEPLOYMENT

**Status:** ✅ Ready for Deployment

---

## LOCAL TESTING

### Prerequisites
```bash
docker --version  # Should be v29+
docker-compose --version  # Should be v2.40+
```

### Setup
```bash
# 1. Prepare environment
cp .env.example .env.local
# Edit .env.local with real values

# 2. Build image
docker build -t fixia:latest .

# 3. Start services
docker-compose up -d

# 4. Verify
docker-compose ps
# Should show: fixia-app (Up), fixia-db (Up), fixia-tunnel (Up)
```

### Verification Tests

**Test 1: Local Health Check**
```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok"}
```

**Test 2: Database Connection**
```bash
docker-compose exec db psql -U postgres -d fixia -c "SELECT COUNT(*) FROM \"User\";"
```

**Test 3: API Endpoint**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test","email":"test@fixia.com",
    "password":"Test123456!","confirmPassword":"Test123456!",
    "role":"CLIENT","location":"Buenos Aires","dni":"12345678"
  }'
```

---

## CLOUDFLARE TUNNEL SETUP

### Step 1: Create Tunnel
1. Go to: https://one.dash.cloudflare.com/
2. Navigate: Zero Trust → Networks → Tunnels
3. Click: Create Tunnel
4. Name: `fixia-prod`
5. Copy the **installation token**

### Step 2: Configure Environment
```bash
# Add to .env:
TUNNEL_TOKEN=<paste_token_here>
```

### Step 3: Configure Public Hostname
In Cloudflare Dashboard:
- **Subdomain:** fixia
- **Domain:** yourdomain.com
- **Protocol:** HTTP
- **URL:** http://fixia-app:3000

This creates: `fixia.yourdomain.com` → `http://fixia-app:3000`

---

## DEPLOYMENT STEPS

### Pre-Deployment Checklist
- [ ] All `.env` variables set (no placeholders)
- [ ] Cloudflare tunnel created + token obtained
- [ ] Docker build succeeds: `docker build -t fixia:latest .`
- [ ] Local tests pass (all 3 tests above)
- [ ] Backups configured

### Deploy to Production
```bash
# 1. Pull latest images
docker-compose pull

# 2. Start services
docker-compose up -d

# 3. Verify status
docker-compose ps
docker-compose logs app

# 4. Test
curl https://fixia.yourdomain.com/api/health
```

### Post-Deployment
```bash
# Monitor for issues
docker-compose logs -f app

# Check resource usage
docker stats

# Expected (idle): Memory 200-400MB, CPU <5%
```

---

## DOCKER CONFIGURATION REVIEW

### ✅ Good Practices Found
- ✅ Health checks configured (30s interval)
- ✅ Service dependencies properly set
- ✅ Restart policy: always
- ✅ Non-root user (nextjs) in production
- ✅ PostgreSQL Alpine (lightweight)
- ✅ Network isolation via docker networks
- ✅ Proper environment variable handling

### ⚠️ Recommendations

**1. Database Password**
Current: `password` (hardcoded in docker-compose.yml)
```bash
# Change to random:
# In docker-compose.yml and .env:
POSTGRES_PASSWORD=$(openssl rand -base64 32)
```

**2. Add Log Rotation**
```yaml
# In docker-compose.yml, add to each service:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

**3. Resource Limits**
```yaml
# In docker-compose.yml, add to app service:
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
    reservations:
      cpus: '1'
      memory: 512M
```

**4. Backup Strategy**
```bash
# Daily backup script:
#!/bin/bash
docker-compose exec -T db pg_dump -U postgres fixia > \
  ./backups/fixia_$(date +%Y%m%d_%H%M%S).sql
```

**5. Update Security**
- [ ] Change PostgreSQL password from default
- [ ] Generate strong JWT_SECRET
- [ ] Set real API keys (Resend, MercadoPago)
- [ ] Validate MERCADOPAGO_WEBHOOK_SECRET

---

## TROUBLESHOOTING

### App Won't Start
```bash
docker-compose logs app

# Solutions:
# 1. Database not ready: Wait 60s
# 2. Port 3000 in use: Change in docker-compose.yml
# 3. Memory issue: Increase Docker memory limit

docker-compose restart app
```

### Database Connection Failed
```bash
docker-compose logs db

# Fix:
docker-compose down -v
docker-compose up -d db
docker-compose exec db psql -U postgres -c "CREATE DATABASE fixia;"
docker-compose up -d app
```

### Tunnel Not Connecting
```bash
docker-compose logs tunnel

# Solutions:
# 1. Token expired: Get new token from Cloudflare
# 2. Network issue: Check internet connection
# 3. Port blocked: Check firewall rules

docker-compose restart tunnel
```

---

## QUICK COMMANDS

```bash
# Start all services
docker-compose up -d

# Stop services (keep data)
docker-compose down

# View live logs
docker-compose logs -f app

# Connect to database
docker-compose exec db psql -U postgres -d fixia

# Rebuild after code changes
docker-compose up -d --build app

# Check resource usage
docker stats

# Run database migrations
docker-compose exec app npm run prisma migrate deploy

# Clean up everything (⚠️ deletes data)
docker-compose down -v
```

---

## ESTIMATED REQUIREMENTS

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU Cores | 1 | 2+ |
| RAM | 2GB | 4GB+ |
| Disk | 10GB | 20GB+ |
| Bandwidth | 1Mbps | 10Mbps+ |
| Concurrent Users | 10 | 100+ |

---

## MONITORING

**Create monitor.sh:**
```bash
#!/bin/bash
echo "🐳 FIXIA MONITORING"
docker-compose ps
echo ""
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.CPUPerc}}"
echo ""
curl -s http://localhost:3000/api/health | jq .
```

Run with: `bash monitor.sh`

---

## DEPLOYMENT STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Docker Setup | ✅ Ready | Properly configured |
| Dockerfile | ✅ Ready | Multi-stage build, optimized |
| docker-compose | ✅ Ready | Health checks enabled |
| Cloudflare Tunnel | ✅ Ready | Just need token |
| Security | ⚠️ Improve | Change default password |
| Monitoring | ⚠️ Add | Create monitoring script |
| Backups | ⚠️ Add | Create backup plan |

---

## NEXT STEPS

1. **This Week:** Deploy to production using steps above
2. **Monitor:** Watch logs + resource usage for 48h
3. **Optimize:** Apply performance fixes from AUDIT_REPORT.md
4. **Scale:** Add load balancing if needed

**Expected Uptime:** 99%+ (with proper monitoring)
