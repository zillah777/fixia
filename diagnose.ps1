# Script de diagnóstico para fixia.app

Write-Host "🔍 DIAGNÓSTICO DE FIXIA.APP" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Docker
Write-Host "1️⃣  Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker instalado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no encontrado" -ForegroundColor Red
    exit 1
}

# 2. Verificar conexión a daemon
Write-Host ""
Write-Host "2️⃣  Verificando conexión a Docker daemon..." -ForegroundColor Yellow
try {
    docker ps > $null
    Write-Host "✅ Docker daemon activo" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker daemon no responde" -ForegroundColor Red
    Write-Host "   💡 Solución: Abre Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# 3. Estado de contenedores
Write-Host ""
Write-Host "3️⃣  Estado de contenedores..." -ForegroundColor Yellow
$containers = docker compose ps
Write-Host $containers
Write-Host ""

# 4. Verificar logs
Write-Host "4️⃣  Últimos logs de la app..." -ForegroundColor Yellow
try {
    $logs = docker compose logs --tail=20 app
    Write-Host $logs
} catch {
    Write-Host "⚠️  No se pudieron obtener logs (container puede no existir)" -ForegroundColor Yellow
}

# 5. Verificar base de datos
Write-Host ""
Write-Host "5️⃣  Verificando base de datos..." -ForegroundColor Yellow
try {
    $dbHealth = docker compose ps db | Select-String "healthy\|unhealthy"
    if ($dbHealth) {
        Write-Host $dbHealth
    } else {
        Write-Host "⚠️  Estado de DB no claro" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudo verificar DB" -ForegroundColor Yellow
}

# 6. Verificar espacios en disco
Write-Host ""
Write-Host "6️⃣  Verificando espacio en disco..." -ForegroundColor Yellow
$diskUsage = docker system df
Write-Host $diskUsage

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📋 RESUMEN" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si ves contenedores detenidos (status 'Exited'), ejecuta:" -ForegroundColor Yellow
Write-Host "  .\deploy.ps1" -ForegroundColor Green
Write-Host ""
Write-Host "Si ves errores de memoria, ejecuta:" -ForegroundColor Yellow
Write-Host "  docker system prune -a" -ForegroundColor Green
Write-Host ""
Write-Host "Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "  docker compose logs -f app" -ForegroundColor Green
Write-Host ""
