import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Shield } from "lucide-react"

// This would typically come from a database or API
const VALID_CATEGORIES = ["plomeria", "electricidad", "limpieza", "gasista", "jardineria", "pintura"]

interface ServiceCategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export function generateStaticParams() {
    return VALID_CATEGORIES.map((category) => ({
        category,
    }))
}

export default async function ServiceCategoryPage({ params }: ServiceCategoryPageProps) {
    const { category } = await params

    // Simple validation/capitalization
    if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
        // In a real app you might want to show a 404 or a generic search page
        // notFound()
    }

    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <Badge className="mb-4" variant="secondary">Servicios de {categoryName}</Badge>
                <h1 className="text-4xl font-bold mb-4">Encuentra los mejores expertos en {categoryName}</h1>
                <p className="text-xl text-muted-foreground">
                    Profesionales verificados y calificados listos para ayudarte con tus necesidades de {category.toLowerCase()}.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Mock Professionals */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                                        {categoryName[0]}P
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Profesional {i}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> Zona {i}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className="flex gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    4.{8 + (i % 2)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    Identidad verificada
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    Especialista en todo tipo de trabajos de {category.toLowerCase()}.
                                    Experiencia garantizada y referencias comprobables.
                                </p>
                                <Button className="w-full">Contactar</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
