-- ============================================================================
-- MIGRACIÓN INCREMENTAL PARA RAILWAY POSTGRESQL
-- ============================================================================
-- Añade solo las tablas faltantes sin modificar las existentes
-- Fecha: 2025-01-05
-- ============================================================================

-- ============================================================================
-- VERIFICAR Y CREAR TIPOS ENUM FALTANTES
-- ============================================================================

-- Tipos para reservas
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'pendiente', 'confirmada', 'en_progreso', 'completada', 
        'cancelada', 'no_show', 'rechazada'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE availability_type AS ENUM ('disponible', 'ocupado', 'bloqueado', 'descanso');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recurrence_type AS ENUM ('unica', 'diaria', 'semanal', 'quincenal', 'mensual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tipos para chat
DO $$ BEGIN
    CREATE TYPE chat_tipo AS ENUM ('directo', 'grupal', 'soporte');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_tipo AS ENUM ('texto', 'imagen', 'archivo', 'ubicacion', 'sistema');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE participant_rol AS ENUM ('admin', 'participante', 'moderador');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tipos para archivos
DO $$ BEGIN
    CREATE TYPE file_type AS ENUM ('image', 'document', 'video', 'audio', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE file_status AS ENUM ('uploading', 'processing', 'ready', 'failed', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE file_context AS ENUM (
        'profile_photo', 'service_image', 'service_gallery', 'verification_document',
        'chat_attachment', 'review_image', 'portfolio_image', 'id_document', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- SISTEMA DE RESERVAS Y DISPONIBILIDAD
-- ============================================================================

-- TABLA: disponibilidad_ases
CREATE TABLE IF NOT EXISTS disponibilidad_ases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    as_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Fecha y hora del slot
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    
    -- Estado del slot
    estado availability_type DEFAULT 'disponible',
    
    -- Configuración del slot
    duracion_minutos INTEGER NOT NULL DEFAULT 60,
    precio_por_hora DECIMAL(10,2),
    servicios_incluidos UUID[],
    
    -- Recurrencia
    tipo_recurrencia recurrence_type DEFAULT 'unica',
    fecha_fin_recurrencia DATE,
    dias_semana INTEGER[],
    
    -- Metadatos
    notas TEXT,
    ubicacion_especifica TEXT,
    es_remoto BOOLEAN DEFAULT FALSE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Restricciones
    CONSTRAINT valid_time_range CHECK (hora_fin > hora_inicio),
    CONSTRAINT valid_duration CHECK (duracion_minutos > 0 AND duracion_minutos <= 480)
);

-- TABLA: reservas
CREATE TABLE IF NOT EXISTS reservas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participantes
    explorador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    as_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    servicio_id UUID REFERENCES servicios(id),
    match_id UUID REFERENCES matches(id),
    
    -- Detalles de la reserva
    fecha_servicio DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_estimada INTEGER NOT NULL,
    
    -- Estado y flujo
    estado booking_status DEFAULT 'pendiente',
    fecha_confirmacion TIMESTAMP,
    fecha_cancelacion TIMESTAMP,
    razon_cancelacion TEXT,
    cancelado_por UUID REFERENCES usuarios(id),
    
    -- Ubicación del servicio
    direccion_servicio TEXT NOT NULL,
    latitud_servicio DECIMAL(10, 7),
    longitud_servicio DECIMAL(10, 7),
    es_remoto BOOLEAN DEFAULT FALSE,
    
    -- Detalles del servicio
    titulo_servicio VARCHAR(200) NOT NULL,
    descripcion_trabajo TEXT,
    precio_acordado DECIMAL(10,2) NOT NULL,
    precio_por_hora DECIMAL(10,2),
    
    -- Seguimiento del tiempo
    hora_inicio_real TIMESTAMP,
    hora_fin_real TIMESTAMP,
    tiempo_total_minutos INTEGER,
    
    -- Recordatorios y notificaciones
    recordatorio_24h_enviado BOOLEAN DEFAULT FALSE,
    recordatorio_1h_enviado BOOLEAN DEFAULT FALSE,
    notificacion_inicio_enviada BOOLEAN DEFAULT FALSE,
    
    -- Evaluación post-servicio
    calificacion_enviada BOOLEAN DEFAULT FALSE,
    encuesta_completada BOOLEAN DEFAULT FALSE,
    
    -- Pagos
    pago_requerido BOOLEAN DEFAULT TRUE,
    pago_procesado BOOLEAN DEFAULT FALSE,
    fecha_pago TIMESTAMP,
    metodo_pago VARCHAR(50),
    
    -- Notas adicionales
    notas_explorador TEXT,
    notas_as TEXT,
    instrucciones_especiales TEXT,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Restricciones
    CONSTRAINT valid_reservation_time CHECK (hora_fin > hora_inicio),
    CONSTRAINT valid_duration_check CHECK (duracion_estimada > 0),
    CONSTRAINT valid_price CHECK (precio_acordado >= 0),
    CONSTRAINT different_users CHECK (explorador_id != as_id)
);

-- TABLA: reservas_historial
CREATE TABLE IF NOT EXISTS reservas_historial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reserva_id UUID NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    
    estado_anterior booking_status,
    estado_nuevo booking_status NOT NULL,
    
    cambiado_por UUID REFERENCES usuarios(id),
    motivo TEXT,
    detalles JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: bloqueos_disponibilidad
CREATE TABLE IF NOT EXISTS bloqueos_disponibilidad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    as_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Período bloqueado
    fecha_inicio DATE NOT NULL,
    hora_inicio TIME,
    fecha_fin DATE NOT NULL,
    hora_fin TIME,
    
    -- Información del bloqueo
    motivo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    es_bloqueo_completo BOOLEAN DEFAULT TRUE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: plantillas_horarios
CREATE TABLE IF NOT EXISTS plantillas_horarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    as_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_plantilla_default BOOLEAN DEFAULT FALSE,
    
    -- Configuración de la plantilla (JSONB)
    configuracion JSONB NOT NULL,
    
    activa BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: configuracion_recordatorios
CREATE TABLE IF NOT EXISTS configuracion_recordatorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Configuración de recordatorios
    recordatorio_24h BOOLEAN DEFAULT TRUE,
    recordatorio_2h BOOLEAN DEFAULT TRUE,
    recordatorio_30m BOOLEAN DEFAULT FALSE,
    
    -- Métodos de notificación
    via_whatsapp BOOLEAN DEFAULT TRUE,
    via_push BOOLEAN DEFAULT TRUE,
    via_email BOOLEAN DEFAULT FALSE,
    
    -- Configuración para AS
    recordatorio_nueva_reserva BOOLEAN DEFAULT TRUE,
    recordatorio_cancelacion BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(usuario_id)
);

-- ============================================================================
-- SISTEMA DE CHAT Y MENSAJERÍA
-- ============================================================================

-- TABLA: chats
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    tipo chat_tipo DEFAULT 'directo',
    titulo VARCHAR(200),
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    ultimo_mensaje_id UUID,
    ultimo_mensaje_fecha TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: chat_participants
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    rol participant_rol DEFAULT 'participante',
    unido_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    notificaciones_activas BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(chat_id, usuario_id)
);

-- TABLA: chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    reply_to_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    
    -- Contenido del mensaje
    content TEXT NOT NULL,
    tipo message_tipo DEFAULT 'texto',
    
    -- Para archivos adjuntos
    archivo_url VARCHAR(500),
    archivo_nombre VARCHAR(255),
    archivo_size INTEGER,
    archivo_tipo VARCHAR(100),
    
    -- Para mensajes de ubicación
    ubicacion_lat DECIMAL(10, 7),
    ubicacion_lng DECIMAL(10, 7),
    ubicacion_direccion TEXT,
    
    -- Metadata adicional
    metadata JSONB DEFAULT '{}',
    
    -- Estados del mensaje
    editado BOOLEAN DEFAULT false,
    editado_en TIMESTAMP WITH TIME ZONE,
    eliminado BOOLEAN DEFAULT false,
    eliminado_en TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: message_reads
CREATE TABLE IF NOT EXISTS message_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    leido_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(message_id, user_id)
);

-- TABLA: chat_typing_indicators
CREATE TABLE IF NOT EXISTS chat_typing_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 seconds'),
    
    UNIQUE(chat_id, user_id)
);

-- ============================================================================
-- SISTEMA DE FAVORITOS
-- ============================================================================

-- TABLA: favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
    
    nota_personal TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(usuario_id, servicio_id)
);

-- TABLA: listas_favoritos
CREATE TABLE IF NOT EXISTS listas_favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icono VARCHAR(50) DEFAULT 'star',
    
    publica BOOLEAN DEFAULT false,
    compartible BOOLEAN DEFAULT true,
    
    orden INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: favoritos_lista
CREATE TABLE IF NOT EXISTS favoritos_lista (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lista_id UUID REFERENCES listas_favoritos(id) ON DELETE CASCADE,
    favorito_id UUID REFERENCES favoritos(id) ON DELETE CASCADE,
    
    orden INTEGER DEFAULT 0,
    agregado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(lista_id, favorito_id)
);

-- TABLA: favoritos_compartidos
CREATE TABLE IF NOT EXISTS favoritos_compartidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lista_id UUID REFERENCES listas_favoritos(id) ON DELETE CASCADE,
    compartido_por UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    compartido_con UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    puede_editar BOOLEAN DEFAULT false,
    puede_agregar BOOLEAN DEFAULT false,
    mensaje TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(lista_id, compartido_con)
);

-- ============================================================================
-- SISTEMA DE ARCHIVOS
-- ============================================================================

-- TABLA: archivos
CREATE TABLE IF NOT EXISTS archivos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    nombre_original VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    tamaño INTEGER NOT NULL,
    
    tipo file_type NOT NULL,
    estado file_status DEFAULT 'uploading',
    contexto file_context DEFAULT 'other',
    
    url_publica TEXT,
    path_storage TEXT,
    url_thumbnail TEXT,
    
    ancho INTEGER,
    alto INTEGER,
    duracion INTEGER,
    
    subido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    ip_origen INET,
    user_agent TEXT,
    
    metadata JSONB DEFAULT '{}',
    
    publico BOOLEAN DEFAULT false,
    requiere_auth BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- TABLA: archivos_relaciones
CREATE TABLE IF NOT EXISTS archivos_relaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    archivo_id UUID REFERENCES archivos(id) ON DELETE CASCADE,
    
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id UUID NOT NULL,
    
    campo VARCHAR(50),
    orden INTEGER DEFAULT 0,
    descripcion TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(archivo_id, entidad_tipo, entidad_id, campo)
);

-- TABLA: archivos_temporales
CREATE TABLE IF NOT EXISTS archivos_temporales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    archivo_id UUID REFERENCES archivos(id) ON DELETE CASCADE,
    
    token_temporal VARCHAR(255) UNIQUE NOT NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: configuracion_archivos
CREATE TABLE IF NOT EXISTS configuracion_archivos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    max_size_image INTEGER DEFAULT 10485760,
    max_size_document INTEGER DEFAULT 52428800,
    max_size_video INTEGER DEFAULT 104857600,
    max_size_audio INTEGER DEFAULT 20971520,
    
    allowed_image_types TEXT[] DEFAULT ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp'],
    allowed_document_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx'],
    allowed_video_types TEXT[] DEFAULT ARRAY['mp4', 'avi', 'mov', 'webm'],
    allowed_audio_types TEXT[] DEFAULT ARRAY['mp3', 'wav', 'aac', 'ogg'],
    
    thumbnail_sizes JSONB DEFAULT '[
        {"name": "small", "width": 150, "height": 150},
        {"name": "medium", "width": 400, "height": 400},
        {"name": "large", "width": 800, "height": 600}
    ]',
    
    storage_provider VARCHAR(50) DEFAULT 'local',
    storage_config JSONB DEFAULT '{}',
    
    cdn_enabled BOOLEAN DEFAULT false,
    cdn_base_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SISTEMA DE VERIFICACIÓN
-- ============================================================================

-- TABLA: verification_history
CREATE TABLE IF NOT EXISTS verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_verificacion VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP,
    documentos_subidos JSONB,
    notas TEXT,
    procesado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT chk_verification_history_estado CHECK (estado IN ('pending', 'approved', 'rejected')),
    CONSTRAINT chk_verification_history_tipo CHECK (tipo_verificacion IN ('identity', 'address', 'professional', 'phone', 'email'))
);

-- TABLA: verification_types
CREATE TABLE IF NOT EXISTS verification_types (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    requerido BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    orden_display INTEGER DEFAULT 0
);

-- ============================================================================
-- FOREIGN KEYS ADICIONALES
-- ============================================================================

-- Agregar FK circular para último mensaje en chats (solo si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_chats_ultimo_mensaje'
    ) THEN
        ALTER TABLE chats 
        ADD CONSTRAINT fk_chats_ultimo_mensaje 
        FOREIGN KEY (ultimo_mensaje_id) REFERENCES chat_messages(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_disponibilidad_as_fecha ON disponibilidad_ases(as_id, fecha, hora_inicio);
CREATE INDEX IF NOT EXISTS idx_disponibilidad_estado ON disponibilidad_ases(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_explorador ON reservas(explorador_id, fecha_servicio DESC);
CREATE INDEX IF NOT EXISTS idx_reservas_as ON reservas(as_id, fecha_servicio DESC);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_servicio ON reservas(fecha_servicio, hora_inicio);

-- Índices para chat
CREATE INDEX IF NOT EXISTS idx_chats_match_id ON chats(match_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_participants_usuario_id ON chat_participants(usuario_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);

-- Índices para favoritos
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_servicio_id ON favoritos(servicio_id);
CREATE INDEX IF NOT EXISTS idx_listas_favoritos_usuario_id ON listas_favoritos(usuario_id);

-- Índices para archivos
CREATE INDEX IF NOT EXISTS idx_archivos_subido_por ON archivos(subido_por);
CREATE INDEX IF NOT EXISTS idx_archivos_tipo ON archivos(tipo);
CREATE INDEX IF NOT EXISTS idx_archivos_estado ON archivos(estado);
CREATE INDEX IF NOT EXISTS idx_archivos_relaciones_entidad ON archivos_relaciones(entidad_tipo, entidad_id);

-- ============================================================================
-- TRIGGERS PARA AUDITORÍA
-- ============================================================================

-- Función para actualizar updated_at (solo si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para nuevas tablas
DROP TRIGGER IF EXISTS trigger_disponibilidad_updated_at ON disponibilidad_ases;
CREATE TRIGGER trigger_disponibilidad_updated_at
    BEFORE UPDATE ON disponibilidad_ases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_reservas_updated_at ON reservas;
CREATE TRIGGER trigger_reservas_updated_at
    BEFORE UPDATE ON reservas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_chats_updated_at ON chats;
CREATE TRIGGER trigger_chats_updated_at
    BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_favoritos_updated_at ON favoritos;
CREATE TRIGGER trigger_favoritos_updated_at
    BEFORE UPDATE ON favoritos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_archivos_updated_at ON archivos;
CREATE TRIGGER trigger_archivos_updated_at
    BEFORE UPDATE ON archivos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para verificar disponibilidad de AS
CREATE OR REPLACE FUNCTION check_as_availability(
    p_as_id UUID,
    p_fecha DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
    blocked_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflict_count
    FROM reservas
    WHERE as_id = p_as_id
    AND fecha_servicio = p_fecha
    AND estado IN ('pendiente', 'confirmada', 'en_progreso')
    AND (hora_inicio < p_hora_fin AND hora_fin > p_hora_inicio);
    
    SELECT COUNT(*) INTO blocked_count
    FROM bloqueos_disponibilidad
    WHERE as_id = p_as_id
    AND p_fecha BETWEEN fecha_inicio AND fecha_fin
    AND (
        es_bloqueo_completo = TRUE
        OR (p_hora_inicio < hora_fin AND p_hora_fin > hora_inicio)
    );
    
    RETURN (conflict_count = 0 AND blocked_count = 0);
END;
$$ LANGUAGE plpgsql;

-- Función para marcar mensajes como leídos
CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_chat_id UUID,
    p_user_id UUID,
    p_until_message_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    IF p_until_message_id IS NULL THEN
        INSERT INTO message_reads (message_id, user_id)
        SELECT cm.id, p_user_id
        FROM chat_messages cm
        WHERE cm.chat_id = p_chat_id 
          AND cm.sender_id != p_user_id
          AND cm.eliminado = FALSE
          AND NOT EXISTS (
              SELECT 1 FROM message_reads mr 
              WHERE mr.message_id = cm.id AND mr.user_id = p_user_id
          );
    ELSE
        INSERT INTO message_reads (message_id, user_id)
        SELECT cm.id, p_user_id
        FROM chat_messages cm
        WHERE cm.chat_id = p_chat_id 
          AND cm.sender_id != p_user_id
          AND cm.eliminado = FALSE
          AND cm.created_at <= (
              SELECT created_at FROM chat_messages WHERE id = p_until_message_id
          )
          AND NOT EXISTS (
              SELECT 1 FROM message_reads mr 
              WHERE mr.message_id = cm.id AND mr.user_id = p_user_id
          );
    END IF;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ language 'plpgsql';

-- ============================================================================
-- DATOS INICIALES
-- ============================================================================

-- Insertar configuración de archivos por defecto
INSERT INTO configuracion_archivos (
    max_size_image, max_size_document, max_size_video, max_size_audio,
    allowed_image_types, allowed_document_types, allowed_video_types, allowed_audio_types,
    thumbnail_sizes, storage_provider, storage_config
) 
SELECT 
    10485760, 52428800, 104857600, 20971520,
    ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp'],
    ARRAY['pdf', 'doc', 'docx'],
    ARRAY['mp4', 'avi', 'mov', 'webm'],
    ARRAY['mp3', 'wav', 'aac', 'ogg'],
    '[{"name": "small", "width": 150, "height": 150}, {"name": "medium", "width": 400, "height": 400}, {"name": "large", "width": 800, "height": 600}]'::jsonb,
    'local',
    '{"upload_path": "/uploads", "temp_path": "/uploads/temp"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM configuracion_archivos);

-- Insertar tipos de verificación
INSERT INTO verification_types (id, nombre, descripcion, requerido, orden_display) VALUES
('identity', 'Verificación de Identidad', 'Verificación de documento nacional de identidad', true, 1),
('phone', 'Verificación de Teléfono', 'Verificación de número de teléfono móvil', true, 2),
('email', 'Verificación de Email', 'Verificación de dirección de correo electrónico', true, 3),
('address', 'Verificación de Domicilio', 'Verificación de dirección de residencia', false, 4),
('professional', 'Verificación Profesional', 'Verificación de títulos y certificaciones', false, 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Contar tablas creadas en esta migración
DO $$
DECLARE
    new_tables_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO new_tables_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN (
        'disponibilidad_ases', 'reservas', 'reservas_historial', 'bloqueos_disponibilidad',
        'plantillas_horarios', 'configuracion_recordatorios', 'chats', 'chat_participants',
        'chat_messages', 'message_reads', 'chat_typing_indicators', 'favoritos',
        'listas_favoritos', 'favoritos_lista', 'favoritos_compartidos', 'archivos',
        'archivos_relaciones', 'archivos_temporales', 'configuracion_archivos',
        'verification_history', 'verification_types'
    );
    
    RAISE NOTICE 'Migración incremental completada. Nuevas tablas agregadas: %', new_tables_count;
END $$;

-- ============================================================================
-- FIN DE LA MIGRACIÓN INCREMENTAL
-- ============================================================================