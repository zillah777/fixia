import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fixia.app'

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/pricing',
        '/how-it-works',
        '/become-a-pro',
        '/help',
        '/login',
        '/register',
        '/services',
        '/terms',
        '/privacy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // In a real app, we would fetch dynamic routes (e.g., professionals) from DB
    // const professionals = await prisma.user.findMany(...)
    // const professionalRoutes = professionals.map(...)

    return [...routes]
}
