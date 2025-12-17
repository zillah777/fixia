# Deployment Guide - Production Ready

## Quick Start: Choose Your Platform

---

## 1. Vercel (Recommended - Simplest)

### Prerequisites
- Vercel account (free tier works)
- GitHub repository connected to Vercel

### Deployment Steps

```bash
# 1. Push code to GitHub (already done, 16 commits ahead)
git push origin main

# 2. Vercel automatically detects push and deploys
# (No additional steps needed!)

# 3. Verify deployment
# Check your Vercel dashboard for deployment status
# Should see "✓ Build successful"
```

### Database Setup in Vercel
```bash
# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables

DATABASE_URL=your_production_database
NEXTAUTH_SECRET=generate_new_secret_32_chars
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production

# Run migrations
# Option A: Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option B: Manual via Vercel Postgres dashboard
```

### Verify Deployment
```bash
# Test endpoints
curl https://your-app.vercel.app/api/certifications
# Should return 401 (unauthorized)

# Test page load
curl https://your-app.vercel.app/dashboard
# Should return HTML
```

---

## 2. Docker (For Self-Hosted)

### Prerequisites
- Docker & Docker Compose installed
- Production server with ~2GB RAM minimum

### Deployment Steps

```bash
# 1. Create Dockerfile (if not exists)
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
EOF

# 2. Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NODE_ENV: production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fixia
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# 3. Create .env.production
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/fixia
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
EOF

# 4. Build and run
docker-compose build
docker-compose up -d

# 5. Run migrations
docker-compose exec app npx prisma migrate deploy

# 6. Verify
curl http://localhost:3000/dashboard
```

### Enable HTTPS with Nginx
```bash
# Create nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Use Let's Encrypt for SSL
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

---

## 3. Manual Linux Deployment

### Prerequisites
- Linux server (Ubuntu 22.04+ recommended)
- Node.js 18+ installed
- PostgreSQL database
- PM2 or systemd for process management

### Deployment Steps

```bash
# 1. SSH into server
ssh user@your-server

# 2. Clone repository
cd /var/www
git clone https://github.com/your-repo/fixia.git
cd fixia

# 3. Install dependencies
npm install

# 4. Set environment variables
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/fixia
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
EOF

# 5. Build application
npm run build

# 6. Run database migrations
npx prisma migrate deploy

# 7. Start with PM2
npm install -g pm2
pm2 start npm --name "fixia" -- start
pm2 save
pm2 startup

# 8. Verify
curl http://localhost:3000/dashboard
```

### Set Up Systemd Service (Alternative to PM2)
```bash
# Create service file
sudo cat > /etc/systemd/system/fixia.service << 'EOF'
[Unit]
Description=Fixia Service
After=network.target

[Service]
Type=simple
User=fixia
WorkingDirectory=/var/www/fixia
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/fixia/.env.local

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable fixia
sudo systemctl start fixia
sudo systemctl status fixia
```

---

## 4. AWS EC2 (With RDS)

### Prerequisites
- AWS account
- EC2 instance running (t3.small minimum)
- RDS PostgreSQL instance

### Deployment Steps

```bash
# 1. SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance.amazonaws.com

# 2. Install dependencies
sudo yum update
sudo yum install nodejs npm git

# 3. Clone and setup (same as Linux manual)
cd /home/ec2-user
git clone https://github.com/your-repo/fixia.git
cd fixia

# 4. Configure environment
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://admin:password@fixia-db.xxxxxx.us-east-1.rds.amazonaws.com:5432/fixia
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
EOF

# 5. Build and start
npm install
npm run build
npm install -g pm2
pm2 start npm --name "fixia" -- start

# 6. Set up reverse proxy with Nginx
sudo amazon-linux-extras install nginx1
sudo systemctl start nginx

# Create nginx config (same as Docker section above)
```

### Connect to RDS
```bash
# Get RDS endpoint from AWS Console
# Format: fixia-db.xxxxxx.us-east-1.rds.amazonaws.com

# Test connection
psql -h fixia-db.xxxxxx.us-east-1.rds.amazonaws.com \
     -U admin -d fixia -c "SELECT 1"

# Run migrations
npx prisma migrate deploy
```

---

## 5. DigitalOcean App Platform (Easiest)

### Prerequisites
- DigitalOcean account
- GitHub repository

### Deployment Steps

```bash
# 1. Create app.yaml in repository root
cat > app.yaml << 'EOF'
name: fixia
services:
- name: web
  github:
    repo: your-username/fixia
    branch: main
  build_command: npm install && npm run build
  run_command: npm start
  http_port: 3000
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXTAUTH_URL
    value: ${APP_DOMAIN}
  - key: DATABASE_URL
    value: postgresql://user:password@db:5432/fixia
databases:
- name: db
  engine: PG
  version: "15"
EOF

# 2. Push to GitHub (already done)
git push origin main

# 3. Connect GitHub to DigitalOcean
# In DigitalOcean Console:
# - Click "Create" > "App"
# - Select GitHub repo
# - Review and deploy

# 4. Set environment variables in console
# NEXTAUTH_SECRET, DATABASE_URL, etc.

# 5. Deploy automatically!
# Any push to main branch auto-deploys
```

---

## Post-Deployment Commands

For any platform, run these verification commands:

```bash
# 1. Check build was successful
npm run build

# 2. Verify database is connected
npx prisma db validate

# 3. Run migrations
npx prisma migrate deploy

# 4. Check migrations applied
npx prisma migrate status

# 5. Test endpoints
curl https://your-domain.com/api/certifications
curl https://your-domain.com/dashboard

# 6. Check environment variables
echo $DATABASE_URL
echo $NEXTAUTH_URL
```

---

## Monitoring & Maintenance

### Health Check Endpoint (Add if needed)
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' }, { status: 200 })
}
```

### Logs
```bash
# Vercel
vercel logs

# Docker
docker-compose logs -f app

# Linux/PM2
pm2 logs fixia

# Systemd
journalctl -u fixia -f
```

### Database Backup
```bash
# PostgreSQL backup
pg_dump -U user fixia > backup-$(date +%Y%m%d).sql

# Restore
psql -U user fixia < backup-20240117.sql
```

---

## Troubleshooting

### Issue: "Build failed"
```bash
# Check logs
npm run build

# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

### Issue: "Database connection error"
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check migrations
npx prisma migrate status
```

### Issue: "Port already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 PID

# Or use different port
PORT=3001 npm start
```

### Issue: "Authentication not working"
```bash
# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Verify NEXTAUTH_URL matches domain
echo $NEXTAUTH_URL

# Clear session data
# Delete cookies from browser Dev Tools
```

---

## Summary

**Easiest Option**: Vercel (just `git push`)
**Most Reliable**: Docker on dedicated server
**Best Value**: DigitalOcean App Platform
**Full Control**: Manual Linux deployment

**All platforms are ready to deploy immediately.**

Choose your platform, follow the steps, and you're live! 🚀
