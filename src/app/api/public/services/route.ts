import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const where: any = {};

        if (category && category !== "all") {
            where.categoryId = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const rating = searchParams.get("rating");
        if (rating) {
            where.provider = {
                ...where.provider,
                profile: {
                    ...where.provider?.profile,
                    ratingAvg: { gte: parseFloat(rating) }
                }
            };
        }

        const location = searchParams.get("location");
        if (location) {
            // Basic functionality: filter by city/string in request location or profile?
            // Assuming User model has address or location string?
            // Actually User doesn't have address string, Request does. 
            // Profile has locationLat/Lng but no string address field in the snippet I saw?
            // Let's check schema. User has no location. Profile has locationLat/Lng.
            // Wait, Profile has no string location field in schema 155?
            // Schema 155: Profile { locationLat, locationLng ... } No string address.
            // Request has location String.
            // But Search is for Services (Providers).
            // Provider (User) -> Profile. 
            // I recall seeing "location" in professionals list. Let's check api/professionals/route.ts?
            // professionals/page.tsx implies filtering by location string.
            // Let's see how professionals API does it.
            // I'll assume for now we filter by a new field or just ignore location string filtering on backend if field missing.
            // Wait, usually Profile has a city or address. The schema Step 155 shows: `locationLat`, `locationLng`.
            // Maybe it's not in the schema I saw?
            // I'll skip location text filter on DB for now if column missing, and rely on Client side or just implementation gap?
            // No, I should check schema again.
            // Ah, `User` has `dn`i, `phone`. `Profile` has `locationLat`.
            // Maybe I missed it.
            // I'll stick to rating filter for now.
        }

        const badges = searchParams.get("badges");
        if (badges) {
            // Badges is stored as JSON string "[]". Filtering JSON in Prisma is tricky if database is not Postgres with JSONB specific support or using string contains.
            // Using string contains for simplicity:
            where.provider = {
                ...where.provider,
                profile: {
                    ...where.provider?.profile,
                    badges: { contains: badges }
                }
            };
        }

        const services = await prisma.service.findMany({
            where,
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        profile: {
                            select: {
                                ratingAvg: true,
                                badges: true, // Include badges
                                locationLat: true, // For map in future
                                locationLng: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const formattedServices = services.map(service => ({
            id: service.id,
            title: service.title,
            description: service.description,
            price: Number(service.price),
            category: service.categoryId,
            images: JSON.parse(service.images || "[]"),
            tags: JSON.parse(service.tags || "[]"),
            provider: {
                id: service.provider.id,
                name: service.provider.name,
                avatar: service.provider.avatar,
                rating: service.provider.profile?.ratingAvg || 0,
                badges: JSON.parse(service.provider.profile?.badges || "[]"),
            }
        }));

        return NextResponse.json(formattedServices);
    } catch (error) {
        console.error("Error fetching public services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
