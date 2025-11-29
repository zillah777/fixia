import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    return <ProfileForm user={session.user} />
}
