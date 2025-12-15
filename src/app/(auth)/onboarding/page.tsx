import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUserById } from "@/lib/db"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Onboarding - Fixia",
    description: "Completa tu configuración inicial en Fixia",
}

export default async function OnboardingPage() {
    const session = await getSession()

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await getUserById(session.user.id)

    if (!user) {
        redirect("/login")
    }

    // If user already completed onboarding, redirect to dashboard
    if (user.completedOnboarding) {
        redirect("/dashboard")
    }

    return (
        <main className="min-h-screen">
            <OnboardingWizard user={user} />
        </main>
    )
}
