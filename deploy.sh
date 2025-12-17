#!/bin/bash
set -e

echo "🚀 Iniciando rebuild de Docker..."
echo ""

# Detener contenedores actuales
echo "⏹️  Deteniendo contenedores..."
docker compose down || true

# Limpiar imágenes previas
echo "🧹 Limpiando imágenes anteriores..."
docker rmi fixiaapp-app || true

# Construir nuevamente
echo "🔨 Construyendo imagen..."
docker compose build --no-cache

# Iniciar contenedores
echo "▶️  Iniciando contenedores..."
docker compose up -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 10

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones Prisma..."
docker compose exec -T app npx prisma migrate deploy

# Verificar salud
echo "✅ Verificando estado de la aplicación..."
docker compose ps

echo ""
echo "✨ ¡Despliegue completado!"
echo "🌐 La aplicación estará disponible en: http://localhost:3000"
echo ""
echo "📋 Logs en tiempo real:"
docker compose logs -f app
