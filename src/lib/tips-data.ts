export interface DailyTip {
    id: string;
    text: string;
    actionLabel?: string;
    actionUrl?: string;
}

export const CLIENT_TIPS: DailyTip[] = [
    {
        id: "c_1",
        text: "¿Sabías que puedes pedir hasta 3 presupuestos para comparar precios?",
        actionLabel: "Ver Solicitudes",
        actionUrl: "/dashboard/requests"
    },
    {
        id: "c_2",
        text: "Revisa las insignias de verificación (Escudo Azul) antes de contratar.",
    },
    {
        id: "c_3",
        text: "¡Sube fotos claras en tus solicitudes para recibir presupuestos más precisos!",
    },
    {
        id: "c_4",
        text: "Al finalizar un trabajo, no olvides calificar al profesional. ¡Ayuda a la comunidad!",
    },
    {
        id: "c_5",
        text: "Usa el chat interno para mantener tus datos de contacto seguros hasta confirmar la visita.",
    }
];

export const PROFESSIONAL_TIPS: DailyTip[] = [
    {
        id: "p_1",
        text: "Completa tu perfil al 100% para aparecer primero en las búsquedas.",
        actionLabel: "Ir al Perfil",
        actionUrl: "/dashboard/profile"
    },
    {
        id: "p_2",
        text: "¡Sube fotos de tus mejores trabajos! Los perfiles con portafolio reciben 2x más contactos.",
        actionLabel: "Subir Fotos",
        actionUrl: "/dashboard/profile" // assuming section anchor works or just general profile
    },
    {
        id: "p_3",
        text: "Responde a las solicitudes en menos de 1 hora para aumentar tus chances de éxito.",
    },
    {
        id: "p_4",
        text: "Pide a tus clientes satisfechos que te dejen una reseña al terminar el trabajo.",
    },
    {
        id: "p_5",
        text: "Activa las notificaciones para no perderte ninguna oportunidad en tu zona.",
        actionLabel: "Configurar",
        actionUrl: "/dashboard/settings"
    }
];
