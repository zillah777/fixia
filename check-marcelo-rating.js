const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function checkMarceloRating() {
    const marceloId = 'f1cffc60-b262-4461-91bc-18a7d870f2f5';

    const profile = await prisma.profile.findUnique({
        where: { userId: marceloId }
    });

    console.log(`Marcelo's Rating:`, profile?.ratingAvg);

    await prisma.$disconnect();
}

checkMarceloRating();
