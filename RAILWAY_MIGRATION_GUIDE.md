# Guía de Migración para Railway PostgreSQL

## 📋 Resumen

Esta guía detalla el proceso completo de migración de la base de datos de Fixia hacia Railway PostgreSQL. La migración incluye **38 tablas principales** con todas sus relaciones, índices, funciones y datos iniciales.

## 🗂️ Estructura de la Base de Datos

### Tablas Principales (38 tablas)

#### **Usuarios y Perfiles**
1. `usuarios` - Usuarios base del sistema
2. `perfiles_ases` - Perfiles de proveedores de servicios
3. `perfiles_exploradores` - Perfiles de buscadores de servicios

#### **Servicios y Categorías**
4. `categorias` - Categorías de servicios
5. `servicios` - Servicios ofrecidos
6. `tags` - Etiquetas/palabras clave
7. `servicio_tags` - Relación servicios-tags

#### **Búsquedas y Matching**
8. `busquedas_servicios` - Búsquedas/demandas
9. `matches` - Sistema de matching
10. `calificaciones` - Sistema de calificaciones

#### **Notificaciones**
11. `notificaciones` - Sistema de notificaciones

#### **Suscripciones y Pagos**
12. `suscripciones` - Suscripciones del sistema
13. `promociones` - Promociones y descuentos
14. `uso_promociones` - Uso de promociones
15. `facturas` - Facturas del sistema
16. `pagos` - Pagos MercadoPago

#### **Autenticación**
17. `refresh_tokens` - Tokens de autenticación

#### **Sistema de Reservas**
18. `disponibilidad_ases` - Disponibilidad de ases
19. `reservas` - Sistema de reservas/citas
20. `reservas_historial` - Historial de estados
21. `bloqueos_disponibilidad` - Bloqueos temporales
22. `plantillas_horarios` - Plantillas de horarios
23. `configuracion_recordatorios` - Configuración de recordatorios

#### **Sistema de Chat**
24. `chats` - Chats del sistema
25. `chat_participants` - Participantes de chat
26. `chat_messages` - Mensajes de chat
27. `message_reads` - Estado de lectura
28. `chat_typing_indicators` - Indicadores de escritura

#### **Sistema de Favoritos**
29. `favoritos` - Favoritos de usuarios
30. `listas_favoritos` - Listas de favoritos
31. `favoritos_lista` - Relación favoritos-listas
32. `favoritos_compartidos` - Favoritos compartidos

#### **Sistema de Archivos**
33. `archivos` - Gestión de archivos
34. `archivos_relaciones` - Relaciones de archivos
35. `archivos_temporales` - Archivos temporales
36. `configuracion_archivos` - Configuración de archivos

#### **Verificación de Identidad**
37. `verification_history` - Historial de verificaciones
38. `verification_types` - Tipos de verificación

## 🚀 Proceso de Migración

### Pre-requisitos

1. **Railway Account**: Cuenta activa en Railway
2. **PostgreSQL Database**: Base de datos PostgreSQL creada en Railway
3. **Node.js**: Versión 16+ instalada
4. **Dependencias**: `pg` package instalado

```bash
npm install pg
```

### Variables de Entorno

Configurar en Railway:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
NODE_ENV=production
```

### Archivos de Migración

- `railway_migration.sql` - Migración principal completa
- `verify_migration.sql` - Script de verificación
- `railway_deploy.js` - Script automatizado de despliegue

### Ejecutar Migración

#### Opción 1: Script Automatizado (Recomendado)

```bash
node railway_deploy.js
```

#### Opción 2: Manual

1. **Ejecutar migración principal**:
```bash
psql $DATABASE_URL -f railway_migration.sql
```

2. **Verificar migración**:
```bash
psql $DATABASE_URL -f verify_migration.sql
```

## 📊 Verificación Post-Migración

### 1. Verificar Conexión

```sql
SELECT NOW(), version();
```

### 2. Contar Tablas

```sql
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
-- Resultado esperado: 38 tablas
```

### 3. Verificar Índices Principales

```sql
SELECT COUNT(*) as total_indexes 
FROM pg_indexes 
WHERE schemaname = 'public';
-- Resultado esperado: 50+ índices
```

### 4. Verificar Datos Iniciales

```sql
-- Verificar categorías
SELECT COUNT(*) FROM categorias;
-- Resultado esperado: 10 categorías

-- Verificar tipos de verificación
SELECT COUNT(*) FROM verification_types;
-- Resultado esperado: 5 tipos

-- Verificar configuración de archivos
SELECT COUNT(*) FROM configuracion_archivos;
-- Resultado esperado: 1 registro
```

## 🔧 Configuración del Backend

### Actualizar database.ts

```typescript
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};
```

### Variables de Railway

Asegurar que estén configuradas:

- `DATABASE_URL` - URL de conexión PostgreSQL
- `NODE_ENV=production`
- Otras variables específicas de la aplicación

## 📝 Funcionalidades Incluidas

### ✅ Características Implementadas

- **Gestión completa de usuarios** (ases y exploradores)
- **Sistema de servicios y categorías**
- **Matching inteligente** entre demanda y oferta
- **Sistema de reservas y disponibilidad**
- **Chat en tiempo real** con múltiples tipos de mensaje
- **Sistema de favoritos** con listas personalizadas
- **Gestión de archivos** con múltiples proveedores
- **Verificación de identidad** con historial completo
- **Suscripciones y pagos** integrado con MercadoPago
- **Sistema de calificaciones** y reviews
- **Notificaciones** multi-canal
- **Índices optimizados** para performance

### 🛡️ Seguridad

- **Constraints** de integridad referencial
- **Validaciones** de datos a nivel de base
- **Soft deletes** para datos críticos
- **Auditoría** con timestamps automáticos
- **Encriptación** preparada para datos sensibles

### ⚡ Performance

- **50+ índices** estratégicamente ubicados
- **Consultas optimizadas** con funciones SQL
- **Particionado** preparado para escalabilidad
- **Triggers** para mantenimiento automático

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de Conexión SSL
```
Error: self signed certificate in certificate chain
```
**Solución**: Verificar configuración SSL en `poolConfig`

#### Error de Permisos
```
Error: permission denied for table
```
**Solución**: Verificar permisos del usuario de base de datos

#### Timeout de Conexión
```
Error: Connection timeout
```
**Solución**: Aumentar `connectionTimeoutMillis` en configuración

### Verificar Estado

```sql
-- Verificar conexiones activas
SELECT count(*) FROM pg_stat_activity 
WHERE state = 'active';

-- Verificar tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Verificar performance de queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC LIMIT 10;
```

## 📈 Monitoreo

### Métricas Importantes

- **Conexiones activas**: Max 20 (configurado en pool)
- **Tamaño de BD**: Monitorear crecimiento
- **Queries lentas**: > 1000ms
- **Errores de conexión**: Rate < 1%

### Comandos Útiles

```sql
-- Top queries por tiempo
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC LIMIT 5;

-- Tablas más grandes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;
```

## 🔄 Backup y Mantenimiento

### Backup Automático

Railway maneja backups automáticos, pero para backups manuales:

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Mantenimiento Regular

```sql
-- Limpiar archivos temporales expirados
SELECT cleanup_expired_temp_files();

-- Actualizar estadísticas
ANALYZE;

-- Reindexar si es necesario
REINDEX DATABASE nombre_database;
```

## 📞 Soporte

Para problemas específicos:

1. **Revisar logs** de Railway
2. **Verificar variables** de entorno
3. **Ejecutar script** de verificación
4. **Consultar documentación** de PostgreSQL

---

**¡Migración completada exitosamente!** 🎉

La base de datos está optimizada y lista para producción en Railway PostgreSQL.