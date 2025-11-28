import { Button } from "@/components/ui/button"

export default function PressPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Prensa y Medios</h1>
                <p className="text-xl text-muted-foreground">
                    Recursos y noticias sobre Fixia para periodistas y creadores de contenido.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Kit de Prensa</h2>
                    <p className="text-muted-foreground mb-6">
                        Descarga nuestros logos, capturas de pantalla y fotos del equipo en alta resolución.
                    </p>
                    <Button variant="outline">Descargar Brand Assets</Button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Contacto de Prensa</h2>
                    <p className="text-muted-foreground mb-6">
                        Para consultas de prensa, entrevistas o información adicional, contáctanos.
                    </p>
                    <Button>press@fixia.app</Button>
                </div>
            </div>
        </div>
    )
}
