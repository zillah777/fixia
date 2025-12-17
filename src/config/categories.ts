export interface Category {
    id: string;
    label: string;
    group: string;
}

export const CATEGORIES: Category[] = [
    // --- HOGAR ---
    { id: "plomeria", label: "Plomería", group: "Hogar" },
    { id: "gasista", label: "Gasista", group: "Hogar" },
    { id: "electricista", label: "Electricista", group: "Hogar" },
    { id: "albañileria", label: "Albañilería", group: "Hogar" },
    { id: "pintura", label: "Pintura", group: "Hogar" },
    { id: "climatizacion", label: "Climatización (AA/Calefacción)", group: "Hogar" },
    { id: "cerrajeria", label: "Cerrajería", group: "Hogar" },
    { id: "carpinteria", label: "Carpintería", group: "Hogar" },
    { id: "vidrieria", label: "Vidriería", group: "Hogar" },
    { id: "techista", label: "Techista / Impermeabilización", group: "Hogar" },
    { id: "jardineria", label: "Jardinería y Paisajismo", group: "Hogar" },
    { id: "piscinas", label: "Mantenimiento de Piscinas", group: "Hogar" },
    { id: "limpieza_hogar", label: "Limpieza de Hogar", group: "Hogar" },
    { id: "desinfeccion", label: "Fumigación y Desinfección", group: "Hogar" },
    { id: "fletes", label: "Fletes y Mudanzas", group: "Hogar" },

    // --- TECNOLOGÍA ---
    { id: "pc_reparacion", label: "Reparación de PC/Notebooks", group: "Tecnología" },
    { id: "celulares", label: "Reparación de Celulares/Tablets", group: "Tecnología" },
    { id: "redes", label: "Instalación de Redes / WiFi", group: "Tecnología" },
    { id: "camaras", label: "Cámaras de Seguridad / Alarmas", group: "Tecnología" },
    { id: "domotica", label: "Domótica y Casa Inteligente", group: "Tecnología" },
    { id: "impresoras", label: "Reparación de Impresoras", group: "Tecnología" },
    { id: "electronica", label: "Electrónica (TV/Audio/Video)", group: "Tecnología" },

    // --- AUTOMOTOR ---
    { id: "mecanica", label: "Mecánica Ligera", group: "Automotor" },
    { id: "baterias", label: "Auxilio de Baterías", group: "Automotor" },
    { id: "cerrajeria_auto", label: "Cerrajería Automotor", group: "Automotor" },
    { id: "lavado_auto", label: "Lavado de Autos a Domicilio", group: "Automotor" },
    { id: "gomeria", label: "Gomería a Domicilio", group: "Automotor" },

    // --- EVENTOS ---
    { id: "dj", label: "DJ y Sonido", group: "Eventos" },
    { id: "catering", label: "Catering y Comida", group: "Eventos" },
    { id: "fotografia", label: "Fotografía y Video", group: "Eventos" },
    { id: "animacion", label: "Animación de Eventos", group: "Eventos" },
    { id: "decoracion", label: "Decoración y Ambientación", group: "Eventos" },

    // --- BELLEZA Y BIENESTAR ---
    { id: "peluqueria", label: "Peluquería a Domicilio", group: "Belleza" },
    { id: "manicuria", label: "Manicuría y Pedicuría", group: "Belleza" },
    { id: "maquillaje", label: "Maquillaje", group: "Belleza" },
    { id: "masajes", label: "Masajes y Estética", group: "Belleza" },
    { id: "entrenador", label: "Entrenador Personal", group: "Belleza" },

    // --- EDUCACIÓN ---
    { id: "clases_apoyo", label: "Clases de Apoyo Escolar", group: "Educación" },
    { id: "idiomas", label: "Clases de Idiomas", group: "Educación" },
    { id: "musica", label: "Clases de Música / Instrumentos", group: "Educación" },

    // --- MASCOTAS ---
    { id: "paseador", label: "Paseador de Perros", group: "Mascotas" },
    { id: "peluqueria_canina", label: "Peluquería Canina", group: "Mascotas" },
    { id: "adiestramiento", label: "Adiestramiento Canino", group: "Mascotas" },
    { id: "cuidado_mascotas", label: "Cuidado de Mascotas (Pet Sitter)", group: "Mascotas" },

    // --- PROFESIONALES ---
    { id: "contador", label: "Contador Público", group: "Profesionales" },
    { id: "abogado", label: "Abogado", group: "Profesionales" },
    { id: "gestoria", label: "Gestoría", group: "Profesionales" },
    { id: "diseno", label: "Diseño Gráfico / Web", group: "Profesionales" },
    { id: "traduccion", label: "Traducción", group: "Profesionales" },
];

export const CATEGORY_GROUPS = Array.from(new Set(CATEGORIES.map(c => c.group)));
