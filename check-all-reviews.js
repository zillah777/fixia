const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function checkAllReviews() {
    const reviews = await prisma.review.findMany({
        include: {
            author: true,
            target: true
        }
    });

    console.log(`Total reviews in DB: ${reviews.length}`);
    reviews.forEach(r => {
        console.log(`Review ${r.id}: Author=${r.author?.name} (${r.authorId}), Target=${r.target?.name} (${r.targetId}), Score=${r.score}, Comment="${r.comment}"`);
    });

    await prisma.$disconnect();
}

checkAllReviews();
