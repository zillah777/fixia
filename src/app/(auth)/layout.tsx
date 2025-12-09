import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col relative z-0">
                {children}
            </main>
            <Footer />
        </div>
    )
}
