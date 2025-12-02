import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Shield } from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const dynamic = "force-dynamic"

// This would typically come from a database or API
const VALID_CATEGORIES = ["plomeria", "electricidad", "limpieza", "gasista", "jardineria", "pintura"]

interface ServiceCategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export default async function ServiceCategoryPage({ params }: ServiceCategoryPageProps) {
    const { category } = await params

    // Simple validation/capitalization
    // if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
    //    notFound()
    // }

    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

    // Fetch professionals for this category
    const professionals = await prisma.user.findMany({
        where: {
            role: "PROFESSIONAL",
            status: "ACTIVE",
            services: {
                some: {
                    categoryId: { equals: category }
                }
            }
        },
        include: {
            profile: true,
            _count: {
                select: { reviewsReceived: true }
            }
        }
    })

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <Badge className="mb-4" variant="secondary">Servicios de {categoryName}</Badge>
                <h1 className="text-4xl font-bold mb-4">Encuentra los mejores expertos en {categoryName}</h1>
                <p className="text-xl text-muted-foreground">
                    Profesionales verificados y calificados listos para ayudarte con tus necesidades de {category.toLowerCase()}.
                </p>
            </div>

            {professionals.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                    {professionals.map((pro) => (
                        <Card key={pro.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-background">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${pro.name}&background=random`} />
                                            <AvatarFallback>{pro.name?.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{pro.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {pro.profile?.locationLat ? "Buenos Aires" : "Ubicación no disp."}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="flex gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {pro.profile?.ratingAvg?.toFixed(1) || "N/A"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        Identidad verificada
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {pro.profile?.bio || `Especialista en ${categoryName}.`}
                                    </p>
                                    <Link href={`/professionals/${pro.id}`} className="w-full block">
                                        <Button className="w-full">Contactar</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground text-lg mb-4">Aún no hay profesionales registrados en esta categoría.</p>
                    <Button variant="outline" asChild>
                        <Link href="/professionals">Ver todos los profesionales</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
