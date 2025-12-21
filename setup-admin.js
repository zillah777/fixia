const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const email = 'admin@fixia.app';
        const hashedPassword = '$2a$10$i9/3ULbVOTDAJWj/POeaBepeoyno2Xh9whfNytTGo2cS3rEYNjpee'; // Hash for Lunitamia123.
        const name = 'Admin Fixia';

        const admin = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE',
                completedOnboarding: true,
                subscriptionStatus: 'active',
                listingVisible: true,
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', email);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
