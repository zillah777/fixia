-- ============================================================================
-- MIGRACIÓN COMPLETA PARA RAILWAY POSTGRESQL
-- ============================================================================
-- Fecha: 2025-01-05
-- Versión: 1.0
-- Descripción: Migración unificada completa del sistema Fixia para Railway
-- ============================================================================

-- ============================================================================
-- EXTENSIONES Y CONFIGURACIÓN INICIAL
-- ============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- TIPOS PERSONALIZADOS (ENUMS)
-- ============================================================================

-- Tipos base
CREATE TYPE user_type AS ENUM ('as', 'explorador', 'ambos');
CREATE TYPE user_status AS ENUM ('pendiente', 'verificado', 'suspendido');
CREATE TYPE education_level AS ENUM ('primario', 'secundario', 'terciario', 'universitario', 'posgrado');
CREATE TYPE price_type AS ENUM ('por_hora', 'por_trabajo', 'por_semana', 'por_mes');
CREATE TYPE search_status AS ENUM ('activa', 'pausada', 'completada', 'cancelada');
CREATE TYPE match_status AS ENUM ('sugerido', 'contactado', 'rechazado', 'completado');
CREATE TYPE contact_method AS ENUM ('whatsapp', 'chat_interno', 'telefono');
CREATE TYPE notification_type AS ENUM ('match', 'mensaje', 'calificacion', 'sistema', 'pago');
CREATE TYPE subscription_status AS ENUM ('pendiente', 'activa', 'cancelada', 'pausada');
CREATE TYPE payment_status AS ENUM ('pendiente', 'aprobado', 'rechazado', 'cancelado');

-- Tipos para reservas
CREATE TYPE booking_status AS ENUM (
    'pendiente', 'confirmada', 'en_progreso', 'completada', 
    'cancelada', 'no_show', 'rechazada'
);
CREATE TYPE availability_type AS ENUM ('disponible', 'ocupado', 'bloqueado', 'descanso');
CREATE TYPE recurrence_type AS ENUM ('unica', 'diaria', 'semanal', 'quincenal', 'mensual');

-- Tipos para chat
CREATE TYPE chat_tipo AS ENUM ('directo', 'grupal', 'soporte');
CREATE TYPE message_tipo AS ENUM ('texto', 'imagen', 'archivo', 'ubicacion', 'sistema');
CREATE TYPE participant_rol AS ENUM ('admin', 'participante', 'moderador');

-- Tipos para archivos
CREATE TYPE file_type AS ENUM ('image', 'document', 'video', 'audio', 'other');
CREATE TYPE file_status AS ENUM ('uploading', 'processing', 'ready', 'failed', 'deleted');
CREATE TYPE file_context AS ENUM (
    'profile_photo', 'service_image', 'service_gallery', 'verification_document',
    'chat_attachment', 'review_image', 'portfolio_image', 'id_document', 'other'
);

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para actualizar timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- ============================================================================

-- TABLA: usuarios (Base de usuarios)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario user_type NOT NULL,
    estado user_status DEFAULT 'pendiente',
    fecha_registro TIMESTAMP DEFAULT NOW(),
    ultimo_acceso TIMESTAMP,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: perfiles_ases (Perfiles de proveedores de servicios)
CREATE TABLE perfiles_ases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    foto_perfil VARCHAR(500),
    
    -- Documentación identidad
    foto_dni_frente VARCHAR(500),
    foto_dni_dorso VARCHAR(500),
    foto_servicio_propio VARCHAR(500),
    
    -- Ubicación
    direccion TEXT NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    latitud DECIMAL(10, 7),
    longitud DECIMAL(10, 7),
    
    -- Información adicional
    nivel_educativo education_level,
    referencias_laborales TEXT,
    tiene_movilidad BOOLEAN DEFAULT FALSE,
    
    -- Disponibilidad
    disponibilidad_horaria JSONB,
    dias_disponibles INTEGER[],
    
    -- Notificaciones preferences
    radio_notificaciones INTEGER DEFAULT 10,
    servicios_notificaciones UUID[],
    monto_minimo_notificacion DECIMAL(10,2),
    horas_minimas_notificacion INTEGER,
    
    -- Verificación
    identidad_verificada BOOLEAN DEFAULT FALSE,
    profesional_verificado BOOLEAN DEFAULT FALSE,
    fecha_verificacion TIMESTAMP,
    estado_verificacion VARCHAR(20) DEFAULT 'not_started',
    fecha_solicitud_verificacion TIMESTAMP,
    tipo_documento VARCHAR(20),
    notas_verificacion TEXT,
    notas_rechazo TEXT,
    
    -- Suscripción
    suscripcion_activa BOOLEAN DEFAULT FALSE,
    fecha_vencimiento_suscripcion TIMESTAMP,
    suscripcion_id UUID,
    plan_actual VARCHAR(50) DEFAULT 'basico',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_estado_verificacion_ases CHECK (estado_verificacion IN ('not_started', 'pending', 'approved', 'rejected')),
    CONSTRAINT chk_tipo_documento_ases CHECK (tipo_documento IN ('dni', 'passport', 'cedula'))
);

-- TABLA: perfiles_exploradores (Perfiles de buscadores de servicios)
CREATE TABLE perfiles_exploradores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    foto_perfil VARCHAR(500),
    
    -- Ubicación
    direccion TEXT NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    latitud DECIMAL(10, 7),
    longitud DECIMAL(10, 7),
    
    -- Verificación
    identidad_verificada BOOLEAN DEFAULT FALSE,
    fecha_verificacion TIMESTAMP,
    estado_verificacion VARCHAR(20) DEFAULT 'not_started',
    fecha_solicitud_verificacion TIMESTAMP,
    tipo_documento VARCHAR(20),
    notas_verificacion TEXT,
    notas_rechazo TEXT,
    foto_dni_frente UUID,
    foto_dni_dorso UUID,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_estado_verificacion_exploradores CHECK (estado_verificacion IN ('not_started', 'pending', 'approved', 'rejected')),
    CONSTRAINT chk_tipo_documento_exploradores CHECK (tipo_documento IN ('dni', 'passport', 'cedula'))
);

-- TABLA: categorias (Categorías de servicios)
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    color VARCHAR(7),
    activa BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0
);

-- TABLA: servicios (Servicios ofrecidos)
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    as_id UUID REFERENCES perfiles_ases(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias(id),
    
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    
    -- Precios
    tipo_precio price_type NOT NULL,
    precio_desde DECIMAL(10,2) NOT NULL,
    precio_hasta DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'ARS',
    
    -- Disponibilidad específica del servicio
    disponible BOOLEAN DEFAULT TRUE,
    urgente BOOLEAN DEFAULT FALSE,
    
    -- Profesional (si requiere matrícula/título)
    requiere_matricula BOOLEAN DEFAULT FALSE,
    matricula_numero VARCHAR(100),
    titulo_profesional VARCHAR(200),
    documento_respaldo VARCHAR(500),
    
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: tags (Tags/palabras clave)
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) UNIQUE NOT NULL,
    categoria_id UUID REFERENCES categorias(id),
    uso_count INTEGER DEFAULT 0,
    sugerido BOOLEAN DEFAULT FALSE
);

-- TABLA: servicio_tags (Relación servicios-tags)
CREATE TABLE servicio_tags (
    servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (servicio_id, tag_id)
);

-- TABLA: busquedas_servicios (Búsquedas/demandas de servicios)
CREATE TABLE busquedas_servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    explorador_id UUID REFERENCES perfiles_exploradores(id) ON DELETE CASCADE,
    
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria_id UUID REFERENCES categorias(id),
    
    -- Ubicación del trabajo
    direccion_trabajo TEXT,
    latitud_trabajo DECIMAL(10, 7),
    longitud_trabajo DECIMAL(10, 7),
    radio_busqueda INTEGER DEFAULT 10,
    
    -- Presupuesto
    presupuesto_minimo DECIMAL(10,2),
    presupuesto_maximo DECIMAL(10,2),
    tipo_precio price_type,
    
    -- Timing
    fecha_necesaria DATE,
    hora_necesaria TIME,
    urgente BOOLEAN DEFAULT FALSE,
    
    estado search_status DEFAULT 'activa',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: matches (Sistema de matching)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    busqueda_id UUID REFERENCES busquedas_servicios(id) ON DELETE CASCADE,
    servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
    as_id UUID REFERENCES perfiles_ases(id),
    explorador_id UUID REFERENCES perfiles_exploradores(id),
    
    score_matching DECIMAL(3,2),
    distancia_km DECIMAL(5,2),
    
    estado match_status DEFAULT 'sugerido',
    
    fecha_contacto TIMESTAMP,
    metodo_contacto contact_method,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: calificaciones (Sistema de calificaciones)
CREATE TABLE calificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id),
    calificador_id UUID REFERENCES usuarios(id),
    calificado_id UUID REFERENCES usuarios(id),
    
    puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    
    -- Aspectos específicos
    puntualidad INTEGER CHECK (puntualidad >= 1 AND puntualidad <= 5),
    calidad INTEGER CHECK (calidad >= 1 AND calidad <= 5),
    comunicacion INTEGER CHECK (comunicacion >= 1 AND comunicacion <= 5),
    precio_justo INTEGER CHECK (precio_justo >= 1 AND precio_justo <= 5),
    
    publica BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: notificaciones (Sistema de notificaciones)
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    tipo notification_type NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    
    datos_extra JSONB,
    
    leida BOOLEAN DEFAULT FALSE,
    enviada_push BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SISTEMA DE SUSCRIPCIONES Y PAGOS
-- ============================================================================

-- TABLA: suscripciones
CREATE TABLE suscripciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id VARCHAR(50) NOT NULL DEFAULT 'basico',
    estado VARCHAR(20) NOT NULL DEFAULT 'activa',
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    auto_renovacion BOOLEAN DEFAULT true,
    metodo_pago VARCHAR(50),
    precio_mensual DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'ARS',
    datos_pago JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_plan CHECK (plan_id IN ('basico', 'profesional', 'premium')),
    CONSTRAINT valid_estado CHECK (estado IN ('activa', 'suspendida', 'cancelada', 'expirada')),
    CONSTRAINT valid_metodo_pago CHECK (metodo_pago IN ('mercadopago', 'tarjeta', 'transferencia', 'crypto'))
);

-- TABLA: promociones
CREATE TABLE promociones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    descuento_porcentaje INTEGER,
    descuento_fijo DECIMAL(10,2),
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    usos_maximos INTEGER,
    usos_actuales INTEGER DEFAULT 0,
    plan_aplicable VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_descuento CHECK (
        (descuento_porcentaje IS NOT NULL AND descuento_porcentaje BETWEEN 1 AND 100) OR
        (descuento_fijo IS NOT NULL AND descuento_fijo > 0)
    ),
    CONSTRAINT valid_plan_aplicable CHECK (plan_aplicable IN ('basico', 'profesional', 'premium', 'todos'))
);

-- TABLA: uso_promociones
CREATE TABLE uso_promociones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promocion_id UUID REFERENCES promociones(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    suscripcion_id UUID REFERENCES suscripciones(id) ON DELETE CASCADE,
    descuento_aplicado DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(promocion_id, usuario_id)
);

-- TABLA: facturas
CREATE TABLE facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suscripcion_id UUID REFERENCES suscripciones(id) ON DELETE CASCADE,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_vencimiento DATE,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    metodo_pago VARCHAR(50),
    datos_pago JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_estado_factura CHECK (estado IN ('pendiente', 'pagada', 'vencida', 'cancelada'))
);

-- TABLA: pagos (Sistema de pagos MercadoPago)
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suscripcion_id UUID REFERENCES suscripciones(id),
    
    mercadopago_payment_id VARCHAR(100) UNIQUE,
    estado payment_status DEFAULT 'pendiente',
    
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    
    fecha_pago TIMESTAMP,
    metodo_pago VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: refresh_tokens (Tokens de autenticación)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- ============================================================================
-- SISTEMA DE RESERVAS Y DISPONIBILIDAD
-- ============================================================================

-- TABLA: disponibilidad_ases
CREATE TABLE disponibilidad_ases (
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
CREATE TABLE reservas (
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
CREATE TABLE reservas_historial (
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
CREATE TABLE bloqueos_disponibilidad (
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
CREATE TABLE plantillas_horarios (
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
CREATE TABLE configuracion_recordatorios (
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
CREATE TABLE chats (
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
CREATE TABLE chat_participants (
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
CREATE TABLE chat_messages (
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
CREATE TABLE message_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    leido_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(message_id, user_id)
);

-- TABLA: chat_typing_indicators
CREATE TABLE chat_typing_indicators (
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
CREATE TABLE favoritos (
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
CREATE TABLE listas_favoritos (
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
CREATE TABLE favoritos_lista (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lista_id UUID REFERENCES listas_favoritos(id) ON DELETE CASCADE,
    favorito_id UUID REFERENCES favoritos(id) ON DELETE CASCADE,
    
    orden INTEGER DEFAULT 0,
    agregado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(lista_id, favorito_id)
);

-- TABLA: favoritos_compartidos
CREATE TABLE favoritos_compartidos (
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
CREATE TABLE archivos (
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
CREATE TABLE archivos_relaciones (
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
CREATE TABLE archivos_temporales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    archivo_id UUID REFERENCES archivos(id) ON DELETE CASCADE,
    
    token_temporal VARCHAR(255) UNIQUE NOT NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: configuracion_archivos
CREATE TABLE configuracion_archivos (
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
CREATE TABLE verification_history (
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
CREATE TABLE verification_types (
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

-- Agregar FK de suscripción a perfiles_ases
ALTER TABLE perfiles_ases 
ADD CONSTRAINT fk_perfiles_ases_suscripcion 
FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id);

-- Agregar FK circular para último mensaje en chats
ALTER TABLE chats 
ADD CONSTRAINT fk_chats_ultimo_mensaje 
FOREIGN KEY (ultimo_mensaje_id) REFERENCES chat_messages(id) ON DELETE SET NULL;

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices principales
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);

CREATE INDEX idx_perfiles_ases_usuario_id ON perfiles_ases(usuario_id);
CREATE INDEX idx_perfiles_ases_verificado ON perfiles_ases(identidad_verificada);
CREATE INDEX idx_perfiles_ases_suscripcion ON perfiles_ases(suscripcion_activa);
CREATE INDEX idx_perfiles_ases_location ON perfiles_ases(latitud, longitud);

CREATE INDEX idx_perfiles_exploradores_usuario_id ON perfiles_exploradores(usuario_id);
CREATE INDEX idx_perfiles_exploradores_location ON perfiles_exploradores(latitud, longitud);

CREATE INDEX idx_servicios_as_id ON servicios(as_id);
CREATE INDEX idx_servicios_categoria_id ON servicios(categoria_id);
CREATE INDEX idx_servicios_activo ON servicios(activo);
CREATE INDEX idx_servicios_precio ON servicios(precio_desde, precio_hasta);

CREATE INDEX idx_busquedas_explorador_id ON busquedas_servicios(explorador_id);
CREATE INDEX idx_busquedas_categoria_id ON busquedas_servicios(categoria_id);
CREATE INDEX idx_busquedas_estado ON busquedas_servicios(estado);
CREATE INDEX idx_busquedas_location ON busquedas_servicios(latitud_trabajo, longitud_trabajo);

CREATE INDEX idx_matches_busqueda_id ON matches(busqueda_id);
CREATE INDEX idx_matches_servicio_id ON matches(servicio_id);
CREATE INDEX idx_matches_as_id ON matches(as_id);
CREATE INDEX idx_matches_explorador_id ON matches(explorador_id);
CREATE INDEX idx_matches_estado ON matches(estado);

CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_notificaciones_tipo ON notificaciones(tipo);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Índices para reservas
CREATE INDEX idx_reservas_explorador ON reservas(explorador_id, fecha_servicio DESC);
CREATE INDEX idx_reservas_as ON reservas(as_id, fecha_servicio DESC);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_fecha_servicio ON reservas(fecha_servicio, hora_inicio);

-- Índices para chat
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id, created_at DESC);
CREATE INDEX idx_chat_participants_usuario_id ON chat_participants(usuario_id);

-- Índices para favoritos
CREATE INDEX idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX idx_favoritos_servicio_id ON favoritos(servicio_id);

-- Índices para archivos
CREATE INDEX idx_archivos_subido_por ON archivos(subido_por);
CREATE INDEX idx_archivos_tipo ON archivos(tipo);
CREATE INDEX idx_archivos_estado ON archivos(estado);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Triggers para updated_at
CREATE TRIGGER trigger_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_perfiles_ases_updated_at 
    BEFORE UPDATE ON perfiles_ases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_perfiles_exploradores_updated_at 
    BEFORE UPDATE ON perfiles_exploradores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_servicios_updated_at 
    BEFORE UPDATE ON servicios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_busquedas_servicios_updated_at 
    BEFORE UPDATE ON busquedas_servicios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_refresh_tokens_updated_at 
    BEFORE UPDATE ON refresh_tokens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCIONES AUXILIARES ESPECÍFICAS
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

-- Función para limpiar archivos temporales expirados
CREATE OR REPLACE FUNCTION cleanup_expired_temp_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE archivos 
    SET estado = 'deleted', deleted_at = NOW()
    WHERE id IN (
        SELECT a.id 
        FROM archivos a
        JOIN archivos_temporales at ON a.id = at.archivo_id
        WHERE at.expires_at < NOW()
          AND a.estado != 'deleted'
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM archivos_temporales WHERE expires_at < NOW();
    
    RETURN deleted_count;
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
) VALUES (
    10485760, 52428800, 104857600, 20971520,
    ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp'],
    ARRAY['pdf', 'doc', 'docx'],
    ARRAY['mp4', 'avi', 'mov', 'webm'],
    ARRAY['mp3', 'wav', 'aac', 'ogg'],
    '[{"name": "small", "width": 150, "height": 150}, {"name": "medium", "width": 400, "height": 400}, {"name": "large", "width": 800, "height": 600}]'::jsonb,
    'local',
    '{"upload_path": "/uploads", "temp_path": "/uploads/temp"}'::jsonb
);

-- Insertar tipos de verificación
INSERT INTO verification_types (id, nombre, descripcion, requerido, orden_display) VALUES
('identity', 'Verificación de Identidad', 'Verificación de documento nacional de identidad', true, 1),
('phone', 'Verificación de Teléfono', 'Verificación de número de teléfono móvil', true, 2),
('email', 'Verificación de Email', 'Verificación de dirección de correo electrónico', true, 3),
('address', 'Verificación de Domicilio', 'Verificación de dirección de residencia', false, 4),
('professional', 'Verificación Profesional', 'Verificación de títulos y certificaciones', false, 5)
ON CONFLICT (id) DO NOTHING;

-- Insertar promociones de ejemplo
INSERT INTO promociones (codigo, descripcion, descuento_porcentaje, fecha_vencimiento, plan_aplicable) VALUES 
('BIENVENIDO20', 'Descuento de bienvenida 20%', 20, NOW() + INTERVAL '6 months', 'todos'),
('PROFESIONAL50', '50% de descuento en plan profesional', 50, NOW() + INTERVAL '3 months', 'profesional'),
('PREMIUM30', '30% de descuento en plan premium', 30, NOW() + INTERVAL '1 month', 'premium')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

-- Comentarios sobre las tablas principales
COMMENT ON TABLE usuarios IS 'Usuarios base del sistema';
COMMENT ON TABLE perfiles_ases IS 'Perfiles de proveedores de servicios';
COMMENT ON TABLE perfiles_exploradores IS 'Perfiles de buscadores de servicios';
COMMENT ON TABLE servicios IS 'Servicios ofrecidos por los ases';
COMMENT ON TABLE matches IS 'Sistema de matching entre demanda y oferta';
COMMENT ON TABLE reservas IS 'Sistema de reservas y citas';
COMMENT ON TABLE chats IS 'Sistema de chat en tiempo real';
COMMENT ON TABLE favoritos IS 'Sistema de favoritos de usuarios';
COMMENT ON TABLE archivos IS 'Sistema de gestión de archivos';
COMMENT ON TABLE verification_history IS 'Historial de verificaciones de identidad';

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================

-- Verificar que todas las tablas se crearon correctamente
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    RAISE NOTICE 'Migración completada. Total de tablas creadas: %', table_count;
END $$;