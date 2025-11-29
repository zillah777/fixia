import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
            <div className="w-full max-w-md space-y-4">
                {children}
            </div>
        </div>
    )
}
