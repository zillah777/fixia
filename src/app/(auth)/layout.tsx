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
                <Link href="/" className="flex flex-col items-center mb-8">
                    <Image
                        src="/logo.svg"
                        alt="Fixia"
                        width={120}
                        height={120}
                        className="mb-3 object-contain"
                    />
                    <p className="text-muted-foreground text-sm">La plataforma de servicios bajo demanda.</p>
                </Link>
                {children}
            </div>
        </div>
    )
}
