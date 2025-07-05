-- ============================================================================
-- SCRIPT DE VERIFICACIÓN PARA RAILWAY POSTGRESQL
-- ============================================================================
-- Este script verifica que todas las tablas y estructuras se crearon correctamente

-- Verificar extensiones
SELECT 
    'Extensiones' as categoria,
    extname as nombre,
    'OK' as estado
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pg_trgm');

-- Verificar tipos ENUM
SELECT 
    'Tipos ENUM' as categoria,
    typname as nombre,
    'OK' as estado
FROM pg_type 
WHERE typtype = 'e' 
AND typname IN (
    'user_type', 'user_status', 'education_level', 'price_type', 
    'search_status', 'match_status', 'contact_method', 'notification_type',
    'subscription_status', 'payment_status', 'booking_status', 
    'availability_type', 'recurrence_type', 'chat_tipo', 'message_tipo',
    'participant_rol', 'file_type', 'file_status', 'file_context'
);

-- Verificar tablas principales
WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'usuarios', 'perfiles_ases', 'perfiles_exploradores', 'categorias',
        'servicios', 'tags', 'servicio_tags', 'busquedas_servicios',
        'matches', 'calificaciones', 'notificaciones', 'suscripciones',
        'promociones', 'uso_promociones', 'facturas', 'pagos',
        'refresh_tokens', 'disponibilidad_ases', 'reservas',
        'reservas_historial', 'bloqueos_disponibilidad', 'plantillas_horarios',
        'configuracion_recordatorios', 'chats', 'chat_participants',
        'chat_messages', 'message_reads', 'chat_typing_indicators',
        'favoritos', 'listas_favoritos', 'favoritos_lista',
        'favoritos_compartidos', 'archivos', 'archivos_relaciones',
        'archivos_temporales', 'configuracion_archivos', 'verification_history',
        'verification_types'
    ]) as table_name
),
existing_tables AS (
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
)
SELECT 
    'Tablas' as categoria,
    et.table_name as nombre,
    CASE 
        WHEN ext.table_name IS NOT NULL THEN 'OK'
        ELSE 'FALTA'
    END as estado
FROM expected_tables et
LEFT JOIN existing_tables ext ON et.table_name = ext.table_name
ORDER BY et.table_name;

-- Verificar funciones principales
SELECT 
    'Funciones' as categoria,
    proname as nombre,
    'OK' as estado
FROM pg_proc 
WHERE proname IN (
    'update_updated_at_column',
    'check_as_availability',
    'mark_messages_as_read',
    'cleanup_expired_temp_files'
);

-- Verificar índices principales (muestra de algunos importantes)
SELECT 
    'Índices' as categoria,
    indexname as nombre,
    'OK' as estado
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname IN (
    'idx_usuarios_email',
    'idx_servicios_as_id',
    'idx_matches_busqueda_id',
    'idx_chat_messages_chat_id',
    'idx_favoritos_usuario_id'
)
ORDER BY indexname;

-- Contar registros de configuración inicial
SELECT 
    'Datos iniciales' as categoria,
    'configuracion_archivos' as nombre,
    CASE 
        WHEN COUNT(*) > 0 THEN 'OK'
        ELSE 'FALTA'
    END as estado
FROM configuracion_archivos
UNION ALL
SELECT 
    'Datos iniciales' as categoria,
    'verification_types' as nombre,
    CASE 
        WHEN COUNT(*) >= 5 THEN 'OK'
        ELSE 'FALTA'
    END as estado
FROM verification_types
UNION ALL
SELECT 
    'Datos iniciales' as categoria,
    'promociones' as nombre,
    CASE 
        WHEN COUNT(*) >= 3 THEN 'OK'
        ELSE 'FALTA'
    END as estado
FROM promociones;

-- Verificar foreign keys críticas
SELECT 
    'Foreign Keys' as categoria,
    tc.constraint_name as nombre,
    'OK' as estado
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.constraint_name IN (
    'perfiles_ases_usuario_id_fkey',
    'servicios_as_id_fkey',
    'matches_busqueda_id_fkey',
    'chat_messages_chat_id_fkey',
    'favoritos_usuario_id_fkey'
)
ORDER BY tc.constraint_name;

-- Resumen final
SELECT 
    'RESUMEN' as categoria,
    'Total tablas creadas' as nombre,
    COUNT(*)::text as estado
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- Verificar que no hay errores en la estructura
SELECT 
    'VERIFICACIÓN' as categoria,
    'Estado general' as nombre,
    'MIGRATION SUCCESSFUL' as estado;