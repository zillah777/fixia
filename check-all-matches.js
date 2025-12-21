const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function checkAllJuanMatches() {
    const proId = 'ff114c55-618e-4d68-8f6a-e10564b744e2';

    const matches = await prisma.match.findMany({
        where: { providerId: proId },
        include: {
            client: true,
            reviews: true
        }
    });

    console.log(`Juan has ${matches.length} matches as provider.`);
    matches.forEach(m => {
        console.log(`Match ${m.id} with client ${m.client?.name} (${m.client?.id}) - Completed: ${m.isCompleted}`);
        console.log(`- Reviews:`, JSON.stringify(m.reviews, null, 2));
    });

    await prisma.$disconnect();
}

checkAllJuanMatches();
