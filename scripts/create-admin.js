const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@fixia.app';
    const password = 'Lunitamia123.';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Checking for admin user: ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
            completedOnboarding: true,
        },
        create: {
            email,
            name: 'Fixia Admin',
            password: hashedPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
            dni: '00000000',
            phone: '1111111111',
            birthdate: new Date('1990-01-01'),
            completedOnboarding: true,
        },
    });

    console.log(`Admin user created/updated successfully: ${user.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
