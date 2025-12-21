const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function checkMarceloReviews() {
    const marceloId = 'f1cffc60-b262-4461-91bc-18a7d870f2f5';

    const reviews = await prisma.review.findMany({
        where: { authorId: marceloId }
    });

    console.log(`Reviews written by Marcelo (${marceloId}):`, JSON.stringify(reviews, null, 2));

    await prisma.$disconnect();
}

checkMarceloReviews();
