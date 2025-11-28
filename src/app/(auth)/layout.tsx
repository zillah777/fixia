export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tighter text-primary">FIXIA</h1>
                    <p className="text-muted-foreground">La plataforma de servicios bajo demanda.</p>
                </div>
                {children}
            </div>
        </div>
    )
}
