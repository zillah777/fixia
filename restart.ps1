# Script para reiniciar servicios rápidamente

Write-Host "🔄 REINICIANDO SERVICIOS DE FIXIA.APP" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker está corriendo
Write-Host "1️⃣  Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps > $null
    Write-Host "✅ Docker activo" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no responde - abre Docker Desktop" -ForegroundColor Red
    exit 1
}

# Ir al directorio del proyecto
cd "c:\xampp\htdocs\fixia.app"

# Ver estado actual
Write-Host ""
Write-Host "2️⃣  Estado actual:" -ForegroundColor Yellow
docker compose ps
Write-Host ""

# Obtener el estado de los contenedores
$appStatus = docker compose ps app 2>&1 | Select-String -Pattern "Up|Exited|Created"

if ($appStatus -match "Up") {
    Write-Host "✅ App está corriendo" -ForegroundColor Green
    Write-Host ""
    Write-Host "3️⃣  Verificando conectividad..." -ForegroundColor Yellow

    # Intentar conexión
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ API responde correctamente" -ForegroundColor Green
        exit 0
    } catch {
        Write-Host "⚠️  API no responde - reiniciando..." -ForegroundColor Yellow
        docker compose restart app
        Write-Host "✅ App reiniciada" -ForegroundColor Green
        exit 0
    }
} else {
    Write-Host "❌ App está detenida - iniciando..." -ForegroundColor Yellow
    docker compose up -d

    Write-Host ""
    Write-Host "⏳ Esperando 15 segundos para que PostgreSQL esté listo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15

    Write-Host ""
    Write-Host "🗄️  Ejecutando migraciones Prisma..." -ForegroundColor Yellow
    docker compose exec -T app npx prisma migrate deploy 2>&1

    Write-Host ""
    Write-Host "✅ Servicios iniciados" -ForegroundColor Green
    docker compose ps

    Write-Host ""
    Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Yellow
    docker compose logs -f app
}
