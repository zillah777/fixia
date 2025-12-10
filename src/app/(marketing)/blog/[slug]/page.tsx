import { BLOG_POSTS } from "../page"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BlogHero } from "@/components/blog-hero"
import { ShareButton } from "@/components/share-button"

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const post = BLOG_POSTS.find(p => p.slug === resolvedParams.slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <BlogHero
                title={post.title}
                category={post.category}
                date={post.date}
                readTime={post.readTime}
                slug={post.slug}
            />

            {/* Content */}
            <div className="container mx-auto px-4 mt-12">
                <div className="grid md:grid-cols-[1fr_300px] gap-12">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="lead text-xl text-foreground font-medium mb-8">
                            {post.excerpt}
                        </p>

                        {/* Render dynamic blog post content */}
                        <div
                            className="prose prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground prose-li:text-foreground prose-ul:text-foreground prose-strong:text-foreground prose-h2:mt-8 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-3"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8 hidden md:block">
                        <div className="sticky top-24 space-y-8">
                            <ShareButton slug={post.slug} title={post.title} />

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
