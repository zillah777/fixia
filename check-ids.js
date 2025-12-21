const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:password@localhost:5432/fixia"
        }
    }
});

async function checkIds() {
    const authorId = 'ff114c55-618e-4d68-8f6a-e10564b744e2';
    const targetId = 'f1cffc60-b262-4461-91bc-18a7d870f2f5';

    const author = await prisma.user.findUnique({ where: { id: authorId } });
    const target = await prisma.user.findUnique({ where: { id: targetId } });

    console.log("Author (Juan?):", author?.name, author?.role);
    console.log("Target (Client?):", target?.name, target?.role);

    await prisma.$disconnect();
}

checkIds();
