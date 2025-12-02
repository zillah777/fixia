import { Metadata } from "next"
import DashboardLayoutClient from "./dashboard-layout"

export const metadata: Metadata = {
    title: "Dashboard | Fixia",
    description: "Gestiona tus solicitudes, servicios y perfil en Fixia.",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
