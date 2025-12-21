# Script de despliegue Docker para Windows/PowerShell

Write-Host "Iniciando rebuild de Docker..." -ForegroundColor Green
Write-Host ""

# Detener contenedores
Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
docker compose down

# Limpiar imágenes
Write-Host "Limpiando imagenes anteriores..." -ForegroundColor Yellow
docker rmi fixiaapp-app -f 2>$null

# Construir
Write-Host "Construyendo imagen..." -ForegroundColor Yellow
docker compose build --no-cache

# Iniciar
Write-Host "Iniciando contenedores..." -ForegroundColor Yellow
docker compose up -d

# Esperar a PostgreSQL
Write-Host "Esperando a que PostgreSQL este listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Migraciones
Write-Host "Ejecutando migraciones Prisma..." -ForegroundColor Yellow
docker compose exec -T app npx prisma migrate deploy

# Estado
Write-Host "Verificando estado..." -ForegroundColor Yellow
docker compose ps

Write-Host ""
Write-Host "Despliegue completado!" -ForegroundColor Green
Write-Host "Disponible en: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Mostrando logs..." -ForegroundColor Cyan
docker compose logs -f app
