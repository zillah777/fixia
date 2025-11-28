import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CareersPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Únete al equipo de Fixia</h1>
                <p className="text-xl text-muted-foreground">
                    Estamos construyendo el futuro de los servicios profesionales.
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Senior Frontend Developer</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">Remoto</Badge>
                                <Badge variant="outline">Full-time</Badge>
                            </div>
                        </div>
                        <Button>Aplicar</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Buscamos un experto en React y Next.js para liderar nuestro equipo de frontend.
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Product Designer</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">Híbrido</Badge>
                                <Badge variant="outline">Full-time</Badge>
                            </div>
                        </div>
                        <Button>Aplicar</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Ayúdanos a diseñar experiencias increíbles para nuestros usuarios.
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Marketing Manager</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">Remoto</Badge>
                                <Badge variant="outline">Full-time</Badge>
                            </div>
                        </div>
                        <Button>Aplicar</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Lidera nuestras estrategias de crecimiento y adquisición de usuarios.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
