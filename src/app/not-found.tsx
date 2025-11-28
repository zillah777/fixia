import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
                <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <div className="flex gap-4">
                <Link href="/dashboard">
                    <Button>Ir al Dashboard</Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">Volver al Inicio</Button>
                </Link>
            </div>
        </div>
    )
}
