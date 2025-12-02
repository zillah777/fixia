export const SUBSCRIPTION_PLANS = {
    PROFESSIONAL: {
        id: "professional_plan",
        title: "Suscripción Profesional Fixia",
        price: 5000,
        currency: "ARS",
        frequency: "monthly",
        features: [
            "Perfil destacado con insignia VERIFICADO",
            "Propuestas ilimitadas",
            "Prioridad en resultados de búsqueda",
            "Soporte prioritario"
        ]
    }
} as const;
