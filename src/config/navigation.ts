import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    User,
    Settings,
    Search,
    CreditCard
} from "lucide-react"

export const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Mis Solicitudes", href: "/dashboard/requests" },
    { icon: Search, label: "Explorar Trabajos", href: "/dashboard/marketplace" },
    { icon: Calendar, label: "Reservas", href: "/dashboard/bookings" },
    { icon: User, label: "Perfil", href: "/dashboard/profile" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
]

export const professionalItems = [
    { icon: CreditCard, label: "Suscripción", href: "/dashboard/subscription" }
]
