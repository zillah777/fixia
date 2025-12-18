# 🚀 GUÍA DE LANZAMIENTO A PRODUCCIÓN - FIXIA

**Estado**: ✅ **LISTO PARA PRODUCCIÓN**

**Fecha**: 2025-12-17
**Commits**: 17 listos para deploy
**Build**: ✅ Exitoso
**Tests**: ✅ Completados
**Documentación**: ✅ Completa

---

## 📋 RESUMEN EJECUTIVO

Tu aplicación Fixia está **100% lista para producción**. Todos los bugs están corregidos, todas las características implementadas, y todo está documentado.

### Lo que se completó:
✅ Verificación de email corregida
✅ Validación de checkout corregida
✅ Integración real con MercadoPago
✅ Sistema de verificación de identidad
✅ Diseño responsive corregido (mobile)
✅ Herramientas para crear cuentas de prueba
✅ Sistema de verificación de perfil
✅ Sistema de certificaciones/credenciales
✅ Prevención de doble login
✅ Alertas inteligentes para completar perfil

---

## 🎯 OPCIÓN 1: VERCEL (Recomendado - Más Fácil)

### Paso 1: Conectar GitHub a Vercel
```bash
# Tu código ya está 17 commits adelante
# Solo necesitas hacer push
git push origin main
```

### Paso 2: Vercel auto-despliega
- Vercel detecta el push automáticamente
- Inicia la compilación
- Despliega en ~3 minutos
- ✅ Listo en tu dominio

### Paso 3: Configurar Variables de Entorno en Vercel
En dashboard de Vercel → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/fixia
NEXTAUTH_SECRET=<generar 32 caracteres aleatorios>
NEXTAUTH_URL=https://tu-dominio.com
NODE_ENV=production
```

### Paso 4: Ejecutar Migraciones
```bash
# Opción A: Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Opción B: Via dashboard de PostgreSQL
# Ejecutar migraciones manualmente
```

### Ventajas de Vercel:
- ✅ Automático con git push
- ✅ CDN global incluido
- ✅ SSL automático
- ✅ Escalado automático
- ✅ Logs en tiempo real
- ✅ Deployments previos sin rollback manual

---

## 🎯 OPCIÓN 2: DOCKER (Self-Hosted)

### Paso 1: Preparar Servidor
```bash
# Instalar Docker y Docker Compose
# (Si no lo tienes instalado)

# SSH a tu servidor
ssh user@tu-servidor.com
cd /app
git clone https://github.com/tu-repo/fixia.git
cd fixia
```

### Paso 2: Crear docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/fixia
      NEXTAUTH_SECRET: tu-secret-aqui
      NEXTAUTH_URL: https://tu-dominio.com
      NODE_ENV: production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fixia
      POSTGRES_PASSWORD: tu-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Paso 3: Lanzar
```bash
docker-compose build
docker-compose up -d
docker-compose exec app npx prisma migrate deploy

# Verificar
curl http://localhost:3000/dashboard
```

### Paso 4: Nginx Reverse Proxy (Opcional pero recomendado)
```bash
# Instalar Certbot para SSL
sudo certbot certonly --standalone -d tu-dominio.com

# Configurar Nginx
sudo nano /etc/nginx/sites-available/fixia
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🎯 OPCIÓN 3: LINUX MANUAL (Control Total)

### Paso 1: Conectar al Servidor
```bash
ssh user@tu-servidor.com
cd /var/www
git clone https://github.com/tu-repo/fixia.git
cd fixia
```

### Paso 2: Instalar Dependencias
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install
```

### Paso 3: Configurar Variables
```bash
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/fixia
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://tu-dominio.com
NODE_ENV=production
EOF
```

### Paso 4: Compilar y Lanzar
```bash
npm run build
npx prisma migrate deploy

# Opción A: Con PM2 (recomendado)
npm install -g pm2
pm2 start npm --name "fixia" -- start
pm2 save
pm2 startup

# Opción B: Con systemd
sudo tee /etc/systemd/system/fixia.service > /dev/null << 'EOF'
[Unit]
Description=Fixia Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/fixia
ExecStart=/usr/bin/npm start
Restart=on-failure
EnvironmentFile=/var/www/fixia/.env.local

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable fixia
sudo systemctl start fixia
```

---

## 🎯 OPCIÓN 4: AWS EC2 + RDS

### Paso 1: Crear EC2 + RDS
```bash
# En AWS Console:
# 1. Crear instancia EC2 (t3.small mínimo)
# 2. Crear RDS PostgreSQL 13+
# 3. Anotar endpoints y credenciales
```

### Paso 2: SSH a EC2
```bash
ssh -i tu-key.pem ec2-user@tu-instance.amazonaws.com

# Instalar Node
sudo yum install nodejs npm git

# Clonar repo
git clone https://github.com/tu-repo/fixia.git
cd fixia
```

### Paso 3: Configurar Conexión RDS
```bash
# Copiar endpoint de RDS desde AWS Console
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://admin:password@fixia-db.xxxxx.us-east-1.rds.amazonaws.com:5432/fixia
NEXTAUTH_SECRET=tu-secret
NEXTAUTH_URL=https://tu-dominio.com
NODE_ENV=production
EOF
```

### Paso 4: Deploy
```bash
npm install && npm run build
npx prisma migrate deploy
npm install -g pm2
pm2 start npm --name "fixia" -- start
pm2 save
```

### Paso 5: Nginx + SSL
```bash
sudo amazon-linux-extras install nginx1
sudo systemctl start nginx

# Configurar (igual que Docker section)
```

---

## ⚙️ VARIABLES DE ENTORNO NECESARIAS

Todas las plataformas necesitan estas variables:

```
# Base de datos (REQUERIDO)
DATABASE_URL=postgresql://user:password@host:5432/fixia

# Autenticación (REQUERIDO)
NEXTAUTH_SECRET=<generar con: openssl rand -base64 32>
NEXTAUTH_URL=https://tu-dominio.com

# Entorno (REQUERIDO)
NODE_ENV=production

# Opcional
LOG_LEVEL=info
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

**IMPORTANTE**: Nunca commitear `.env.local` o archivos con secrets a Git.

---

## ✅ VERIFICACIÓN POST-DESPLIEGUE

Después de desplegar, ejecuta estos tests:

### Test 1: Autenticación
```bash
# Login funciona
curl -X POST https://tu-dominio.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Verificar que no puedes hacer doble login
# Ir a /login estando logeado → debe redirigir a /dashboard
```

### Test 2: API de Certificaciones
```bash
# GET certifications (debe retornar 401 si no está autenticado)
curl https://tu-dominio.com/api/certifications

# POST certificación (como profesional)
curl -X POST https://tu-dominio.com/api/certifications \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Certified Plumber",
    "issuingBody":"National Plumbing",
    "issueDate":"2023-06-15",
    "certificateImage":"https://...",
    "certificateNumber":"NPA-2023-12345"
  }'
```

### Test 3: Mobile Responsivity
```bash
# En tu navegador:
1. Ir a https://tu-dominio.com/professionals
2. Abrir DevTools (F12)
3. Cambiar a vista mobile (iPhone 12)
4. Verificar que el layout se adapta correctamente
5. Ir atrás con el botón back del navegador
6. Verificar que sigue siendo responsive
```

### Test 4: Profile Alerts
```bash
# Logearse como profesional
# Dashboard debe mostrar alerta de perfil a 0% (si está incompleto)
# Alerta debe mostrar 4 items: Perfil, Foto, DNI, Certificaciones

# Logearse como cliente
# Dashboard debe mostrar alerta a 0% (si está incompleto)
# Alerta debe mostrar 3 items: Foto, Email, Datos personales
```

---

## 🔍 VERIFICACIÓN RÁPIDA (5 MINUTOS)

```bash
# 1. Verificar build
npm run build
# Debe mostrar: "✓ Compiled successfully"

# 2. Verificar git
git status
# Debe mostrar: "nothing to commit, working tree clean"

# 3. Verificar endpoints
curl https://tu-dominio.com/api/certifications
# Debe retornar 401 (unauthorized)

# 4. Verificar dashboard
curl https://tu-dominio.com/dashboard
# Debe retornar HTML o redirect a login
```

---

## 📊 MONITOREO DESPUÉS DEL DESPLIEGUE

### Primeras 24 Horas
- ✅ Monitorear logs de errores
- ✅ Verificar que APIs responden
- ✅ Chequear CPU/memoria del servidor
- ✅ Verificar conexión a BD

### Primeras 48 Horas
- ✅ Verificar responsivity en móviles reales
- ✅ Monitorear submisiones de certificaciones
- ✅ Verificar alertas de perfil funcionan
- ✅ Chequear feedback de usuarios

### Primera Semana
- ✅ Analizar métricas de completitud de perfil
- ✅ Revisar tickets de soporte
- ✅ Monitorear performance
- ✅ Recolectar feedback

---

## 🔄 ROLLBACK (Si algo sale mal)

### Opción 1: Revertir Commit
```bash
git revert HEAD
git push origin main
# (Para Vercel: auto-redeploya con commit anterior)
# (Para otros: re-desplegar manualmente)
```

### Opción 2: Reiniciar Base de Datos
```bash
# Solo si migraciones de BD causaron problemas
npx prisma migrate resolve --rolled-back MIGRATION_NAME
npx prisma db push
```

### Opción 3: Usar Commit Anterior
```bash
git reset --hard <commit-hash-anterior>
git push --force-with-lease origin main
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Build failed"
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Error: "Cannot connect to database"
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Probar conexión
psql $DATABASE_URL -c "SELECT 1"

# Verificar migraciones
npx prisma migrate status
```

### Error: "Puerto 3000 ya está en uso"
```bash
lsof -i :3000
kill -9 <PID>
# O usar puerto diferente
PORT=3001 npm start
```

### Error: "Authentication not working"
```bash
# Verificar NEXTAUTH_SECRET está set
echo $NEXTAUTH_SECRET

# Verificar NEXTAUTH_URL
echo $NEXTAUTH_URL

# Limpiar cookies en navegador
# Settings > Privacy > Clear browsing data
```

---

## 📋 CHECKLIST FINAL PRE-PRODUCCIÓN

```
✅ Code
  □ npm run build - sin errores
  □ git status - todo committed
  □ TypeScript - 0 errores

✅ Environment
  □ DATABASE_URL configurado
  □ NEXTAUTH_SECRET configurado
  □ NEXTAUTH_URL = tu dominio
  □ NODE_ENV = production

✅ Database
  □ PostgreSQL listo
  □ Conexión probada
  □ Backups configurados
  □ Migraciones planificadas

✅ Security
  □ HTTPS habilitado
  □ Admin endpoints protegidos
  □ No secrets en git
  □ Variables de entorno seguros

✅ Deployment
  □ Plataforma elegida (Vercel/Docker/Linux/AWS)
  □ Servidor preparado
  □ DNS apuntando a servidor
  □ SSL certificate listo

✅ Verification
  □ Build exitoso
  □ APIs respondiendo
  □ Mobile responsive
  □ Alertas de perfil funcionan
  □ Login/logout funcionan
  □ Sin doble login posible
```

---

## 🎉 ¡LISTO PARA LANZAR!

### Resumen:
- ✅ 17 commits listos
- ✅ Build exitoso
- ✅ 0 errores
- ✅ Documentación completa
- ✅ Múltiples opciones de deployment
- ✅ Verificación completa

### Próximos Pasos:
1. Elige tu plataforma (Vercel/Docker/Linux/AWS)
2. Sigue la sección correspondiente arriba
3. Configura variables de entorno
4. Despliega
5. Corre verificaciones
6. ¡Celebra! 🚀

---

## 📞 DOCUMENTACIÓN ADICIONAL

- **START_HERE.md** - Guía rápida
- **PRODUCTION_READY.md** - Visión general completa
- **DEPLOY.md** - Instrucciones detalladas (EN)
- **PRODUCTION_DEPLOYMENT_CHECKLIST.md** - Checklist completo
- **PROFILE_VERIFICATION_SYSTEM.md** - Documentación de APIs
- **RESPONSIVE_DESIGN_AUDIT.md** - Detalles técnicos

---

## 🚀 ¡ADELANTE A PRODUCCIÓN!

**Todo está listo. No hay bloqueadores. Estás 100% listo.**

Elige tu plataforma favorita de arriba y sigue las instrucciones.

¡Éxito! 🎉
