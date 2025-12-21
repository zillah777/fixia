const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function fixReview() {
    const reviewId = 'a2bc7584-7baf-4c4b-9c08-9c6444221584';
    const juanId = 'ff114c55-618e-4d68-8f6a-e10564b744e2'; // Pro
    const marceloId = 'f1cffc60-b262-4461-91bc-18a7d870f2f5'; // Client

    console.log("Fixing review IDs...");

    // 1. Swap IDs
    await prisma.review.update({
        where: { id: reviewId },
        data: {
            authorId: marceloId,
            targetId: juanId
        }
    });

    console.log("IDs swapped.");

    // 2. Update Juan's rating (now has 1 review)
    await prisma.profile.update({
        where: { userId: juanId },
        data: { ratingAvg: 5 }
    });

    // 3. Update Marcelo's rating (now has 0 reviews)
    await prisma.profile.update({
        where: { userId: marceloId },
        data: { ratingAvg: 0 }
    });

    console.log("Ratings updated.");

    await prisma.$disconnect();
}

fixReview().catch(console.error);
