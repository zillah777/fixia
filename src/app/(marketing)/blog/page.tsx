import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { BlogImagePlaceholder } from "@/components/blog-image-placeholder"

export const BLOG_POSTS = [
    {
        slug: "como-elegir-profesional",
        title: "Cómo elegir al mejor profesional para tu proyecto",
        excerpt: "Descubre los 5 puntos clave que debes evaluar antes de contratar a un plomero, electricista o cualquier experto.",
        category: "Consejos",
        date: "12 Oct 2025",
        readTime: "5 min",
        content: `
            <h2>Encontrar el profesional adecuado puede marcar la diferencia en tu proyecto</h2>
            <p>Ya sea que necesites un plomero, electricista, diseñador o cualquier otro experto, elegir bien es fundamental para garantizar resultados de calidad y evitar dolores de cabeza.</p>

            <h3>1. Verifica las credenciales y experiencia</h3>
            <p>Asegúrate de que el profesional tenga las licencias necesarias, certificaciones vigentes y experiencia comprobable en el tipo de trabajo que necesitas. En Fixia, todos nuestros profesionales pasan por un proceso de verificación riguroso.</p>

            <h3>2. Lee las reseñas y calificaciones</h3>
            <p>Las opiniones de otros clientes son invaluables. Busca profesionales con calificaciones consistentemente altas y lee detenidamente los comentarios para entender sus fortalezas y áreas de especialización.</p>

            <h3>3. Solicita presupuestos detallados</h3>
            <p>Un buen profesional siempre proporcionará un presupuesto claro y detallado antes de comenzar. Compara diferentes opciones, pero recuerda que el precio más bajo no siempre es la mejor opción.</p>

            <h3>4. Comunica tus expectativas claramente</h3>
            <p>Describe exactamente qué necesitas, tus plazos y cualquier requisito especial. Una comunicación clara desde el principio previene malentendidos y asegura mejores resultados.</p>

            <h3>5. Confía en tu instinto</h3>
            <p>Si algo no se siente bien durante las conversaciones iniciales, es mejor buscar otras opciones. La confianza y la buena comunicación son fundamentales para una colaboración exitosa.</p>

            <h2>Conclusión</h2>
            <p>En Fixia facilitamos este proceso conectándote con profesionales verificados, permitiéndote comparar perfiles, leer reseñas reales y comunicarte directamente antes de tomar una decisión. ¡Encuentra al experto perfecto para tu proyecto hoy!</p>
        `
    },
    {
        slug: "tendencias-remodelacion-2025",
        title: "Top 5 tendencias de remodelación para 2025",
        excerpt: "Desde diseños minimalistas hasta integración de tecnología inteligente, conoce lo que está marcando tendencia.",
        category: "Diseño",
        date: "08 Oct 2025",
        readTime: "7 min",
        content: `
            <h2>El 2025 trae nuevas tendencias que transforman espacios</h2>
            <p>Desde el minimalismo funcional hasta la integración de tecnología inteligente, estas son las tendencias que están redefiniendo los hogares y espacios comerciales este año.</p>

            <h3>1. Espacios Multifuncionales</h3>
            <p>Con el auge del trabajo remoto y la necesidad de optimizar cada metro cuadrado, los espacios multifuncionales son clave. Oficinas que se convierten en salas de estar, cocinas que integran áreas de trabajo y muebles transformables dominan el diseño moderno.</p>

            <h3>2. Sustentabilidad y Materiales Eco-Friendly</h3>
            <p>La conciencia ambiental se refleja en la elección de materiales reciclados, pinturas sin VOC, iluminación LED y sistemas de gestión de energía. Los clientes buscan profesionales que puedan ofrecer soluciones sostenibles sin sacrificar estilo.</p>

            <h3>3. Domótica y Casas Inteligentes</h3>
            <p>La automatización del hogar ya no es lujo sino estándar. Desde termostatos inteligentes hasta sistemas de seguridad conectados, integrar tecnología smart home es esencial en cualquier remodelación moderna.</p>

            <h3>4. Minimalismo con Personalidad</h3>
            <p>Menos es más, pero con carácter. Los espacios limpios y despejados se complementan con piezas statement y toques de color estratégicos que reflejan la personalidad del propietario.</p>

            <h3>5. Integración con el Exterior</h3>
            <p>Grandes ventanales, puertas plegables y espacios que fluyen hacia patios y jardines crean una sensación de amplitud y conexión con la naturaleza, maximizando la luz natural y el bienestar.</p>

            <h2>¿Listo para tu próxima remodelación?</h2>
            <p>En Fixia encontrarás diseñadores, arquitectos y constructores especializados en estas tendencias. Conecta con profesionales que pueden transformar tu visión en realidad.</p>
        `
    },
    {
        slug: "mantenimiento-preventivo",
        title: "La importancia del mantenimiento preventivo",
        excerpt: "Ahorra dinero y evita emergencias realizando pequeños mantenimientos regularmente.",
        category: "Mantenimiento",
        date: "01 Oct 2025",
        readTime: "6 min",
        content: `
            <h2>Prevenir es mejor (y más barato) que reparar</h2>
            <p>El mantenimiento preventivo no solo ahorra dinero a largo plazo, sino que también previene emergencias costosas y prolonga la vida útil de tus instalaciones y equipos.</p>

            <h3>¿Qué es el mantenimiento preventivo?</h3>
            <p>Son las revisiones y reparaciones menores realizadas regularmente para mantener todo en óptimas condiciones antes de que surjan problemas mayores. Es como llevar tu auto al servicio: pequeñas inversiones periódicas evitan grandes averías.</p>

            <h3>Checklist de Mantenimiento Mensual</h3>
            <ul>
                <li>Revisar filtros de aire acondicionado y calefacción</li>
                <li>Verificar grifos y detectar fugas tempranas</li>
                <li>Limpiar canaletas y desagües</li>
                <li>Inspeccionar detectores de humo y monóxido de carbono</li>
                <li>Revisar conexiones eléctricas visibles</li>
            </ul>

            <h3>Checklist de Mantenimiento Trimestral</h3>
            <ul>
                <li>Inspeccionar techos y buscar goteras</li>
                <li>Revisar sistemas de calefacción/refrigeración</li>
                <li>Limpiar y ajustar puertas y ventanas</li>
                <li>Verificar el estado de pinturas y revestimientos</li>
            </ul>

            <h3>Checklist de Mantenimiento Anual</h3>
            <ul>
                <li>Servicio completo de calderas y calefactores</li>
                <li>Inspección profesional de instalaciones eléctricas</li>
                <li>Revisión de plomería y desagües</li>
                <li>Mantenimiento de equipos de aire acondicionado</li>
                <li>Inspección estructural de techos y cimientos</li>
            </ul>

            <h3>Beneficios del Mantenimiento Preventivo</h3>
            <ul>
                <li>Ahorro de hasta 40% en costos de reparación</li>
                <li>Mayor valor de reventa de la propiedad</li>
                <li>Seguridad para tu familia</li>
                <li>Eficiencia energética mejorada</li>
                <li>Tranquilidad y menos estrés</li>
            </ul>

            <h2>Deja el mantenimiento en manos de expertos</h2>
            <p>En Fixia puedes programar mantenimientos regulares con profesionales certificados. Desde plomeros hasta electricistas, encuentra al experto adecuado para cada tarea y mantén todo funcionando perfectamente.</p>
        `
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
                            <div className="relative">
                                <BlogImagePlaceholder slug={post.slug} title={post.title} />
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
