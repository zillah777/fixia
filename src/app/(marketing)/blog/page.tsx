import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function BlogPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Blog de Fixia</h1>
                <p className="text-xl text-muted-foreground">
                    Noticias, consejos y actualizaciones sobre el mundo de los servicios.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Link href="#" key={i} className="group">
                        <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                            <div className="aspect-video bg-muted rounded-t-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                            </div>
                            <CardHeader>
                                <div className="flex gap-2 mb-2">
                                    <Badge variant="secondary">Consejos</Badge>
                                    <span className="text-xs text-muted-foreground flex items-center">5 min lectura</span>
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">
                                    Cómo elegir al mejor profesional para tu hogar
                                </CardTitle>
                                <CardDescription>
                                    Descubre los puntos clave a tener en cuenta antes de contratar.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
