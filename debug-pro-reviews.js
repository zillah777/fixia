const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function checkPro() {
    const proId = 'ff114c55-618e-4d68-8f6a-e10564b744e2';

    try {
        const pro = await prisma.user.findUnique({
            where: { id: proId },
            include: {
                profile: true,
                reviewsReceived: {
                    include: {
                        author: true
                    }
                },
                matchesAsProvider: {
                    include: {
                        reviews: true
                    }
                }
            }
        });

        if (!pro) {
            console.log("Professional not found");
            return;
        }

        console.log("Professional:", {
            id: pro.id,
            name: pro.name,
            role: pro.role,
            ratingAvg: pro.profile?.ratingAvg,
            numReceivedReviews: pro.reviewsReceived?.length,
            numMatches: pro.matchesAsProvider?.length
        });

        if (pro.reviewsReceived.length > 0) {
            console.log("Reviews Received:", pro.reviewsReceived.map(r => ({
                id: r.id,
                author: r.author?.name,
                score: r.score,
                comment: r.comment
            })));
        } else {
            console.log("No reviews received found in relation.");
        }

        if (pro.matchesAsProvider.length > 0) {
            console.log("Matches as Provider Details:");
            pro.matchesAsProvider.forEach(m => {
                console.log(`- Match ID: ${m.id}, Completed: ${m.isCompleted}`);
                console.log(`  Reviews count for this match: ${m.reviews.length}`);
                if (m.reviews.length > 0) {
                    console.log(`  Review Details:`, m.reviews.map(r => ({
                        id: r.id,
                        authorId: r.authorId,
                        targetId: r.targetId,
                        score: r.score,
                        comment: r.comment
                    })));
                }
            });
        }

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkPro();
