#!/bin/bash

# ============================================================================
# SCRIPT DE CONFIGURACIÓN PARA RAILWAY DEPLOYMENT
# ============================================================================
# Este script automatiza la configuración inicial para Railway

set -e  # Exit on any error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Funciones de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BOLD}${BLUE}[$1]${NC} $2"
}

# Verificar dependencias
check_dependencies() {
    log_step "1" "Verificando dependencias..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log_success "Node.js encontrado: $NODE_VERSION"
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    log_success "npm encontrado: $NPM_VERSION"
    
    # Verificar Railway CLI (opcional)
    if command -v railway &> /dev/null; then
        RAILWAY_VERSION=$(railway --version)
        log_success "Railway CLI encontrado: $RAILWAY_VERSION"
    else
        log_warning "Railway CLI no encontrado (opcional)"
        log_info "Para instalar: npm install -g @railway/cli"
    fi
}

# Verificar estructura de archivos
check_files() {
    log_step "2" "Verificando archivos de migración..."
    
    REQUIRED_FILES=(
        "railway_migration.sql"
        "verify_migration.sql"
        "railway_deploy.js"
        "package.json"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            log_success "✓ $file encontrado"
        else
            log_error "✗ $file no encontrado"
            exit 1
        fi
    done
}

# Verificar e instalar dependencias de Node.js
install_dependencies() {
    log_step "3" "Instalando dependencias de Node.js..."
    
    # Verificar si pg está instalado
    if npm list pg &> /dev/null; then
        log_success "Dependencia 'pg' ya está instalada"
    else
        log_info "Instalando dependencia 'pg'..."
        npm install pg
        log_success "Dependencia 'pg' instalada"
    fi
    
    # Verificar si dotenv está instalado
    if npm list dotenv &> /dev/null; then
        log_success "Dependencia 'dotenv' ya está instalada"
    else
        log_info "Instalando dependencia 'dotenv'..."
        npm install dotenv
        log_success "Dependencia 'dotenv' instalada"
    fi
}

# Verificar variables de entorno
check_environment() {
    log_step "4" "Verificando variables de entorno..."
    
    if [[ -z "$DATABASE_URL" ]]; then
        log_warning "DATABASE_URL no está configurada"
        log_info "Necesitas configurar esta variable en Railway"
        log_info "Ejemplo: postgresql://user:password@host:port/database"
    else
        log_success "DATABASE_URL configurada"
        # Ocultar la URL completa por seguridad
        log_info "URL: ${DATABASE_URL:0:20}..."
    fi
    
    if [[ -z "$NODE_ENV" ]]; then
        log_warning "NODE_ENV no está configurada"
        log_info "Se recomienda configurar NODE_ENV=production en Railway"
    else
        log_success "NODE_ENV configurada: $NODE_ENV"
    fi
}

# Verificar conexión a Railway (si CLI está instalado)
check_railway_connection() {
    if command -v railway &> /dev/null; then
        log_step "5" "Verificando conexión a Railway..."
        
        if railway whoami &> /dev/null; then
            RAILWAY_USER=$(railway whoami)
            log_success "Conectado a Railway como: $RAILWAY_USER"
        else
            log_warning "No estás autenticado en Railway"
            log_info "Para autenticarte: railway login"
        fi
    else
        log_step "5" "Railway CLI no disponible - saltando verificación"
    fi
}

# Crear archivo .env de ejemplo
create_env_example() {
    log_step "6" "Creando archivo .env.example..."
    
    if [[ ! -f ".env.example" ]]; then
        cat > .env.example << EOF
# Railway PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database

# Environment
NODE_ENV=production

# Application Settings
PORT=3000

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# MercadoPago (if using)
MERCADOPAGO_ACCESS_TOKEN=your-mercadopago-token
MERCADOPAGO_PUBLIC_KEY=your-mercadopago-public-key

# Email Service (if using)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com

# Storage (if using Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# WhatsApp API (if using)
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_ID=your-phone-id

# FCM for Push Notifications (if using)
FCM_SERVER_KEY=your-fcm-server-key
EOF
        log_success "Archivo .env.example creado"
    else
        log_info "Archivo .env.example ya existe"
    fi
}

# Validar archivos SQL
validate_sql_files() {
    log_step "7" "Validando archivos SQL..."
    
    # Verificar sintaxis básica del archivo de migración
    if grep -q "CREATE TABLE" railway_migration.sql; then
        log_success "✓ railway_migration.sql contiene CREATE TABLE statements"
    else
        log_error "✗ railway_migration.sql no contiene CREATE TABLE statements"
        exit 1
    fi
    
    if grep -q "CREATE INDEX" railway_migration.sql; then
        log_success "✓ railway_migration.sql contiene CREATE INDEX statements"
    else
        log_warning "⚠ railway_migration.sql no contiene CREATE INDEX statements"
    fi
    
    # Verificar archivo de verificación
    if grep -q "SELECT" verify_migration.sql; then
        log_success "✓ verify_migration.sql contiene SELECT statements"
    else
        log_error "✗ verify_migration.sql no contiene SELECT statements"
        exit 1
    fi
}

# Mostrar información del proyecto
show_project_info() {
    log_step "8" "Información del proyecto..."
    
    echo -e "\n${BOLD}📊 RESUMEN DEL PROYECTO FIXIA${NC}"
    echo "=================================="
    
    # Contar líneas en archivos SQL
    MIGRATION_LINES=$(wc -l < railway_migration.sql)
    VERIFICATION_LINES=$(wc -l < verify_migration.sql)
    
    echo "📄 Archivos de migración:"
    echo "   - railway_migration.sql: $MIGRATION_LINES líneas"
    echo "   - verify_migration.sql: $VERIFICATION_LINES líneas"
    
    # Estimar número de tablas
    TABLE_COUNT=$(grep -c "CREATE TABLE" railway_migration.sql)
    echo "   - Tablas a crear: $TABLE_COUNT"
    
    # Estimar número de índices
    INDEX_COUNT=$(grep -c "CREATE INDEX" railway_migration.sql)
    echo "   - Índices a crear: $INDEX_COUNT"
    
    echo ""
    echo "🎯 Próximos pasos:"
    echo "   1. Configurar variables de entorno en Railway"
    echo "   2. Ejecutar: node railway_deploy.js"
    echo "   3. Verificar la migración"
    echo "   4. Probar la conexión desde tu aplicación"
}

# Función principal
main() {
    echo -e "${BOLD}${BLUE}"
    echo "🚀 RAILWAY SETUP PARA FIXIA"
    echo "=========================="
    echo -e "${NC}"
    
    check_dependencies
    check_files
    install_dependencies
    check_environment
    check_railway_connection
    create_env_example
    validate_sql_files
    show_project_info
    
    echo -e "\n${GREEN}${BOLD}✅ SETUP COMPLETADO${NC}"
    echo -e "${GREEN}Todo está listo para la migración a Railway PostgreSQL${NC}"
    echo ""
    echo -e "${YELLOW}Para ejecutar la migración:${NC}"
    echo -e "${BOLD}node railway_deploy.js${NC}"
}

# Ejecutar función principal
main "$@"