import { BLOG_POSTS } from "../page"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const post = BLOG_POSTS.find(p => p.slug === resolvedParams.slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[50vh] relative">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
                    <Link href="/blog">
                        <Button variant="ghost" className="text-white mb-6 hover:text-white hover:bg-white/20">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Blog
                        </Button>
                    </Link>
                    <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">{post.category}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {post.readTime} de lectura
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-12">
                <div className="grid md:grid-cols-[1fr_300px] gap-12">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="lead text-xl text-muted-foreground font-medium mb-8">
                            {post.excerpt}
                        </p>

                        {/* Render dynamic blog post content */}
                        <div
                            className="prose prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-ul:text-foreground/80"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8 hidden md:block">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-muted/30 rounded-xl p-6 border">
                                <h3 className="font-bold text-lg mb-4">Compartir</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    {/* Add more social buttons */}
                                </div>
                            </div>

                            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                <h3 className="font-bold text-lg mb-2">¿Buscas un profesional?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Encuentra expertos verificados en Fixia hoy mismo.
                                </p>
                                <Link href="/services">
                                    <Button className="w-full">Encontrar Expertos</Button>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    )
}
