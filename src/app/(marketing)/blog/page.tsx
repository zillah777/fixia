import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"

export const BLOG_POSTS = [
    {
        slug: "como-elegir-profesional",
        title: "Cómo elegir al mejor profesional para tu hogar",
        excerpt: "Descubre los 5 puntos clave que debes evaluar antes de contratar a un plomero, electricista o cualquier experto.",
        category: "Consejos",
        image: "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=1000&auto=format&fit=crop",
        date: "12 Oct 2025",
        readTime: "5 min",
        content: `
            <p>Encontrar un profesional de confianza puede ser una tarea desalentadora. Aquí te damos una guía paso a paso...</p>
            <h3>1. Verifica las credenciales</h3>
            <p>Asegúrate de que el profesional tenga las licencias necesarias...</p>
        `
    },
    {
        slug: "tendencias-remodelacion-2025",
        title: "Top 5 tendencias de remodelación para 2025",
        excerpt: "Desde cocinas minimalistas hasta baños tipo spa, conoce lo que está marcando tendencia este año.",
        category: "Diseño",
        image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1000&auto=format&fit=crop",
        date: "08 Oct 2025",
        readTime: "7 min",
        content: "..."
    },
    {
        slug: "mantenimiento-preventivo",
        title: "La importancia del mantenimiento preventivo",
        excerpt: "Ahorra dinero y dolores de cabeza realizando pequeños mantenimientos en tu hogar regularmente.",
        category: "Hogar",
        image: "https://images.unsplash.com/photo-1505798577917-a651a5d40320?q=80&w=1000&auto=format&fit=crop",
        date: "01 Oct 2025",
        readTime: "4 min",
        content: "..."
    }
]

export default function BlogPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Blog de Fixia</h1>
                <p className="text-xl text-muted-foreground">
                    Noticias, consejos y actualizaciones para mantener tu hogar perfecto.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.slug} className="group h-full">
                        <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group-hover:-translate-y-1">
                            <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                                        {post.category}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {post.readTime} lectura
                                    </div>
                                </div>
                                <CardTitle className="leading-tight group-hover:text-primary transition-colors text-xl">
                                    {post.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {post.excerpt}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto pt-0">
                                <Button variant="link" className="px-0 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                    Leer artículo <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
