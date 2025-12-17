"use client"

import { HelpDrawer } from "./help-drawer"
import { HelpTopic } from "./help-drawer"

/**
 * Pre-configured help contexts for different forms
 */

const REQUEST_FORM_TOPICS: HelpTopic[] = [
    {
        id: "request-title",
        title: "Cómo escribir un buen título",
        description: "El título es lo primero que ve el profesional. Hazlo claro y específico.",
        tips: [
            "Sé específico: 'Reparación de grifo de agua caliente' en lugar de 'Reparación de plomería'",
            "Menciona la ubicación si es relevante",
            "Usa palabras que los profesionales buscan",
            "Evita palabras genéricas o vagas",
            "Máximo 100 caracteres para que sea legible",
        ],
        examples: [
            "✓ 'Reparación de cañería rota bajo la pileta'",
            "✓ 'Instalación de termotanque en baño principal'",
            "✗ 'Necesito un plomero'",
            "✗ 'Algo no funciona'",
        ],
    },
    {
        id: "request-description",
        title: "Descripción detallada",
        description: "Cuanta más información des, mejor presupuesto recibirás",
        tips: [
            "Describe el problema en detalle",
            "Menciona cuándo comenzó el problema",
            "Especifica qué ya intentaste (si algo)",
            "Incluye dimensiones o medidas si es relevante",
            "Menciona si hay preferencias de material o marca",
            "Indica disponibilidad horaria para que te visiten",
        ],
        examples: [
            "✓ 'El agua sale muy lentamente desde hace 2 semanas. Es una pileta de cocina con monomando. El agua de agua caliente funciona normal, solo el agua fría sale lentamente. Necesitaría que viniera entre semana después de las 17hs.'",
            "✗ 'Se rompió algo de plomería'",
        ],
    },
    {
        id: "request-budget",
        title: "Presupuesto y rango de precios",
        description: "El presupuesto correcto atrae profesionales serios",
        tips: [
            "Sé realista con tu presupuesto",
            "Usa los precios sugeridos como guía",
            "Profesionales caros = mayor experiencia y garantía",
            "Presupuestos muy bajos alejan buenos profesionales",
            "Puedes negociar después del presupuesto inicial",
            "La ubicación afecta el precio (viáticos/traslado)",
        ],
        examples: [
            "✓ Para reparación simple: $2000-$4000",
            "✓ Para instalación nueva: $5000-$10000",
            "✗ Presupuesto demasiado bajo para el trabajo",
        ],
    },
    {
        id: "request-photos",
        title: "Fotos del problema",
        description: "Las fotos claras acelaran el proceso",
        tips: [
            "Toma fotos con buena iluminación (natural si es posible)",
            "Incluye foto general del área y detalles específicos",
            "Evita fotos borrosas o muy oscuras",
            "Múltiples ángulos ayudan a entender mejor",
            "Máximo 3 fotos para no saturar",
            "Si hay detalles específicos, haz zoom",
        ],
    },
]

const SERVICE_FORM_TOPICS: HelpTopic[] = [
    {
        id: "service-title",
        title: "Título atractivo del servicio",
        description: "El título debe ser específico y profesional",
        tips: [
            "Sé específico sobre qué servicio ofreces exactamente",
            "Menciona si tienes especialización",
            "Evita títulos genéricos",
            "Usa palabras que los clientes buscan",
            "Máximo 60 caracteres para claridad",
        ],
        examples: [
            "✓ 'Reparación de cañerías y tuberías'",
            "✓ 'Instalación de aires acondicionados con garantía'",
            "✗ 'Plomería'",
            "✗ 'Servicios varios'",
        ],
    },
    {
        id: "service-description",
        title: "Descripción que convierte",
        description: "La descripción es tu carta de presentación",
        tips: [
            "Explica qué exactamente incluye tu servicio",
            "Menciona tu experiencia y especialización",
            "Destaca garantías o ventajas especiales",
            "Sé honesto sobre limitaciones",
            "Incluye tiempo estimado si es aplicable",
            "Servicios bien descritos reciben 5x más consultas",
        ],
        examples: [
            "✓ 'Reparación y mantenimiento de cañerías. 15 años de experiencia. Incluye diagnostico gratis y garantía de 90 días en reparaciones. Disponible para urgencias las 24hs.'",
            "✗ 'Arreglo cosas de plomería'",
        ],
    },
    {
        id: "service-pricing",
        title: "Estrategia de precios",
        description: "Precios competitivos y realistas atraen clientes",
        tips: [
            "Investiga precios de competidores",
            "Considera tu experiencia y ubicación",
            "Precio bajo ≠ más clientes (muchas veces lo opuesto)",
            "Precios altos requieren justificación (garantía, experiencia)",
            "El precio sugerido es flexible, puedes negociar",
            "Actualiza precios mensualmente según demanda",
        ],
        examples: [
            "✓ $3000-$5000 para reparación, $8000+ para instalación",
            "✗ Precios demasiado bajos (parecen poco profesionales)",
        ],
    },
    {
        id: "service-tags",
        title: "Etiquetas/palabras clave",
        description: "Las etiquetas ayudan a los clientes a encontrarte",
        tips: [
            "Máximo 5 etiquetas relevantes",
            "Usa términos que los clientes buscan",
            "Sé específico: 'Cañería' no es lo mismo que 'Reparación de cañería'",
            "Incluye tu especialización",
            "Revisa qué etiquetas usan competidores exitosos",
        ],
        examples: [
            "✓ Reparación | Cañerías | Urgencias | 24hs | Zona Oeste",
            "✗ Plomería | Trabajo | Profesional | Bueno",
        ],
    },
]

const PROPOSAL_FORM_TOPICS: HelpTopic[] = [
    {
        id: "proposal-price",
        title: "Cómo fijar tu presupuesto",
        description: "Tu presupuesto debe ser competitivo pero rentable",
        tips: [
            "Considera el presupuesto del cliente como guía",
            "Suma costos: materiales, transporte, tiempo de trabajo",
            "Agrega margen de ganancia (30-50%)",
            "Si es mayor que el presupuesto del cliente, explica por qué",
            "Presupuestos realistas ganan más clientes",
            "Presupuestos idénticos al cliente parecen poco profesionales",
        ],
        examples: [
            "✓ Cliente propone $3000-$5000 → Tu presupuesto $4200 con explicación",
            "✗ Presupuesto idéntico al techo del cliente",
        ],
    },
    {
        id: "proposal-message",
        title: "Mensaje ganador",
        description: "Tu mensaje es lo que decides si te elige",
        tips: [
            "Lee cuidadosamente la solicitud antes de responder",
            "Personaliza cada propuesta (nunca copiar y pegar)",
            "Explica por qué TÚ eres el mejor para este trabajo",
            "Responde rápidamente (dentro de 2 horas es ideal)",
            "Sé profesional pero amable",
            "Ofrece soluciones, no solo precios",
        ],
        examples: [
            "✓ 'Hola! He visto tu solicitud de reparación de grifo. Tengo 12 años especializándome en plomería residencial y lo podría arreglar en máx 30 mins. Incluyo revisión completa gratis y 3 meses de garantía. Disponible mañana o pasado mañana. ¿Te va bien?'",
            "✗ 'Dale, cuánto querés que cobre?'",
        ],
    },
    {
        id: "proposal-timing",
        title: "Importancia de la velocidad",
        description: "Responder rápido aumenta mucho tus chances",
        tips: [
            "Responde dentro de 2 horas si es posible",
            "Los clientes ven cuándo respondieron otros",
            "Primera respuesta tiene ventaja psicológica",
            "Si no puedes responder, no envíes propuesta",
            "Disponibilidad inmediata o próximo día es mejor",
            "Menciona tu tiempo de respuesta en el perfil",
        ],
    },
]

const PROFILE_FORM_TOPICS: HelpTopic[] = [
    {
        id: "profile-photo",
        title: "Foto de perfil profesional",
        description: "Tu foto es lo primero que ven los clientes",
        tips: [
            "Usa una foto clara donde se vea bien tu cara",
            "Iluminación natural, evita sombras",
            "Fondo neutral o profesional",
            "Sonríe o expresión profesional (no serio)",
            "Foto actual (no de años atrás)",
            "Ropa casual pero limpia y presentable",
        ],
    },
    {
        id: "profile-bio",
        title: "Biografía impactante",
        description: "Resume tu experiencia en 2-3 párrafos",
        tips: [
            "Empieza fuerte: años de experiencia, especialización",
            "Menciona certificaciones o premios",
            "Habla de qué te hace diferente",
            "Sé honesto, no exageres",
            "Máximo 300 caracteres para ser legible",
            "Profesionales con bio detallada reciben 3x más solicitudes",
        ],
        examples: [
            "✓ 'Plomero con 15 años de experiencia en zona norte. Especialista en reparaciones urgentes y nuevas instalaciones. Garantía de 90 días. Presupuestos sin costo.'",
            "✗ 'Soy buen trabajador y hago bien las cosas'",
        ],
    },
]

const REGISTRATION_FORM_TOPICS: HelpTopic[] = [
    {
        id: "register-role",
        title: "¿Cliente o Profesional?",
        description: "Elige el rol que mejor te representa",
        tips: [
            "CLIENT: Si necesitas contratar profesionales para un trabajo",
            "PROFESSIONAL: Si ofreces servicios a otros",
            "Puedes cambiar de rol después si es necesario",
            "Cada rol tiene funciones y beneficios diferentes",
            "Profesionales pueden crear servicios y recibir solicitudes",
            "Clientes pueden buscar y contratar profesionales",
        ],
    },
    {
        id: "register-password",
        title: "Contraseña segura",
        description: "Protege tu cuenta con una buena contraseña",
        tips: [
            "Mínimo 6 caracteres (recomendado 10+)",
            "Mezcla mayúsculas, minúsculas, números y símbolos",
            "Evita fechas de nacimiento o nombres",
            "No uses contraseña igual a otros servicios",
            "Guarda en lugar seguro (gestor de contraseñas)",
            "Cambiar contraseña cada 6 meses es buena práctica",
        ],
    },
]

/**
 * Exported help drawer configurations for easy integration
 */

const DASHBOARD_TOPICS: HelpTopic[] = [
    {
        id: "dashboard-overview",
        title: "Panel de Control",
        description: "Tu centro de comando para gestionar todo en Fixia",
        tips: [
            "Visualiza tus estadísticas clave de un vistazo",
            "Accede rápidamente a tus últimas actividades",
            "Verifica tu estado de suscripción o verificación",
            "Usa el buscador para encontrar lo que necesitas",
        ],
    },
    {
        id: "dashboard-stats",
        title: "Estadísticas",
        description: "Entiende tus métricas de rendimiento",
        tips: [
            "Las gráficas muestran tu actividad de la última semana",
            "Monitorea tus ingresos o gastos (próximamente)",
            "Identifica tendencias en tus servicios o solicitudes",
        ],
    },
]

const LEADS_TOPICS: HelpTopic[] = [
    {
        id: "leads-overview",
        title: "Oportunidades de Trabajo",
        description: "Encuentra nuevos clientes buscando tus servicios",
        tips: [
            "Revisa las oportunidades diariamente",
            "Usa los filtros para encontrar trabajos en tu zona",
            "Lee bien la descripción antes de postularte",
            "Sé rápido: los primeros en contactar suelen ganar",
        ],
    },
    {
        id: "leads-trust",
        title: "Confianza y Reputación",
        description: "Cómo destacar entre otros profesionales",
        tips: [
            "Completa tu perfil al 100% para generar confianza",
            "Solicita la insignia de Verificado subiendo tu DNI",
            "Pide a tus clientes que te califiquen al terminar",
            "Responde rápido para ganar la insignia 'Rayo'",
        ],
    },
]

const BADGE_TOPICS: HelpTopic[] = [
    {
        id: "badge-verified",
        title: "Insignia Verificado",
        description: "Valida tu identidad y genera máxima confianza",
        tips: [
            "Sube tu DNI o Cédula vigente",
            "Es el factor #1 que miran los clientes",
            "Aumenta tus chances de contratación un 50%",
        ],
    },
    {
        id: "badge-expert",
        title: "Insignia Experto 🏆",
        description: "Para los mejores profesionales de la plataforma",
        tips: [
            "Completa al menos 10 trabajos en Fixia",
            "Mantén un promedio de calificación mayor a 4.5 estrellas",
            "Demuestra consistencia y calidad en el tiempo",
        ],
    },
    {
        id: "badge-trending",
        title: "Insignia Trending 🔥",
        description: "Destaca por tu actividad reciente",
        tips: [
            "Envía más de 5 propuestas en una semana",
            "Mantente activo buscando oportunidades",
            "Indica a los clientes que estás disponible ahora",
        ],
    },
    {
        id: "badge-fast",
        title: "Insignia Rayo ⚡",
        description: "Premia tu velocidad de respuesta",
        tips: [
            "Responde a las solicitudes en menos de 2 horas",
            "Mantén este ritmo en tus últimas 5 propuestas",
            "Los clientes valoran mucho la rapidez",
        ],
    },
]

// ... (other constants remain the same if not modified)

export function LeadsHelp() {
    return (
        <HelpDrawer
            topics={[...LEADS_TOPICS, ...BADGE_TOPICS]}
            defaultTopic="leads-overview"
        />
    )
}

export function DashboardHelp() {
    return (
        <HelpDrawer
            topics={[...DASHBOARD_TOPICS, ...BADGE_TOPICS]}
            defaultTopic="dashboard-overview"
        />
    )
}

// ... (other exports)

const SUBSCRIPTION_TOPICS: HelpTopic[] = [
    {
        id: "sub-benefits",
        title: "Beneficios Premium",
        description: "Por qué suscribirse a Fixia Profesional",
        tips: [
            "Destaca sobre la competencia con el distintivo PRO",
            "Acceso ilimitado a ciertas oportunidades",
            "Menores comisiones por servicio",
            "Soporte prioritario",
        ],
    },
    {
        id: "sub-billing",
        title: "Facturación",
        description: "Gestión de tus pagos y facturas",
        tips: [
            "Puedes cancelar en cualquier momento",
            "Los pagos son procesados de forma segura",
            "Descarga tus facturas desde el panel de configuración",
        ],
    },
]

const REQUESTS_LIST_TOPICS: HelpTopic[] = [
    {
        id: "req-tracking",
        title: "Seguimiento de Solicitudes",
        description: "Gestiona tus búsquedas de servicios",
        tips: [
            "Ve el estado de cada solicitud (Abierta, En Proceso, Cerrada)",
            "Revisa las propuestas recibidas de profesionales",
            "Cancela solicitudes que ya no necesites",
        ],
    },
    {
        id: "req-hiring",
        title: "Contratación",
        description: "Cómo elegir al mejor profesional",
        tips: [
            "Compara perfiles, calificaciones y precios",
            "Habla con el profesional antes de confirmar",
            "Usa el chat de Fixia para mantener registro",
            "No aceptes pagos fuera de la plataforma por seguridad inicial",
        ],
    },
]

const BOOKINGS_TOPICS: HelpTopic[] = [
    {
        id: "bookings-status",
        title: "Estado de Trabajos",
        description: "Controla el progreso de tus servicios contratados",
        tips: [
            "Confirma cuando el trabajo haya iniciado",
            "Marca como completado solo cuando estés 100% satisfecho",
            "Reporta cualquier problema inmediatamente",
        ],
    },
    {
        id: "bookings-rating",
        title: "Calificaciones",
        description: "Ayuda a la comunidad calificando",
        tips: [
            "Sé honesto y detallado en tu reseña",
            "Valora puntualidad, calidad y trato",
            "Tus reseñas ayudan a otros usuarios a elegir mejor",
            "Los profesionales valoran mucho tu feedback",
        ],
    },
]

export function RequestFormHelp() {
    return (
        <HelpDrawer
            topics={REQUEST_FORM_TOPICS}
            defaultTopic="request-title"
        />
    )
}

export function ServiceFormHelp() {
    return (
        <HelpDrawer
            topics={SERVICE_FORM_TOPICS}
            defaultTopic="service-title"
        />
    )
}

export function ProposalFormHelp() {
    return (
        <HelpDrawer
            topics={PROPOSAL_FORM_TOPICS}
            defaultTopic="proposal-message"
        />
    )
}

export function ProfileFormHelp() {
    return (
        <HelpDrawer
            topics={PROFILE_FORM_TOPICS}
            defaultTopic="profile-bio"
        />
    )
}

export function RegistrationFormHelp() {
    return (
        <HelpDrawer
            topics={REGISTRATION_FORM_TOPICS}
            defaultTopic="register-role"
        />
    )
}



export function SubscriptionHelp() {
    return (
        <HelpDrawer
            topics={SUBSCRIPTION_TOPICS}
            defaultTopic="sub-benefits"
        />
    )
}

export function RequestsListHelp() {
    return (
        <HelpDrawer
            topics={REQUESTS_LIST_TOPICS}
            defaultTopic="req-tracking"
        />
    )
}

export function BookingsHelp() {
    return (
        <HelpDrawer
            topics={BOOKINGS_TOPICS}
            defaultTopic="bookings-status"
        />
    )
}
