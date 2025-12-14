import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    User,
    Settings,
    Search,
    CreditCard,
    MessageCircle,
    FolderOpen,
    Bell,
    LogOut
} from "lucide-react"

// Professional Sidebar Menu
export const professionalSidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Perfil", href: "/dashboard/profile" },
    { icon: Search, label: "Oportunidades", href: "/dashboard/opportunities" },
    { icon: Briefcase, label: "Mis Solicitudes", href: "/dashboard/requests" },
    { icon: Briefcase, label: "Mis Servicios", href: "/dashboard/services" },
    { icon: MessageCircle, label: "Mensajes", href: "/dashboard/matches" },
    { icon: FolderOpen, label: "Portafolio", href: "/dashboard/portfolio" },
    { icon: Calendar, label: "Reservas", href: "/dashboard/bookings" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
    { icon: Bell, label: "Test Push", href: "/test-push" },
    // Suscripción is conditional - shown only if not subscribed or cancelled
]

// Professional Avatar Menu (dropdown)
export const professionalAvatarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Perfil", href: "/dashboard/profile" },
    { icon: Search, label: "Oportunidades", href: "/dashboard/opportunities" },
    { icon: Briefcase, label: "Mis Servicios", href: "/dashboard/services" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
]

// Client Sidebar Menu
export const clientSidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Perfil", href: "/dashboard/profile" },
    { icon: Briefcase, label: "Mis Solicitudes", href: "/dashboard/requests" },
    { icon: MessageCircle, label: "Mensajes", href: "/dashboard/matches" },
    { icon: Calendar, label: "Reservas", href: "/dashboard/bookings" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
    { icon: Bell, label: "Test Push", href: "/test-push" },
    // Suscripción is conditional - shown only if not subscribed
]

// Client Avatar Menu (dropdown)
export const clientAvatarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Perfil", href: "/dashboard/profile" },
    { icon: Briefcase, label: "Mis Solicitudes", href: "/dashboard/requests" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
]

// Subscription menu item (conditional)
export const subscriptionItem = { icon: CreditCard, label: "Suscripción", href: "/dashboard/subscription" }

// Logout item
export const logoutItem = { icon: LogOut, label: "Cerrar Sesión", href: "#" }

// Legacy exports for backward compatibility (deprecated)
export const sidebarItems = professionalSidebarItems
export const professionalItems = []
