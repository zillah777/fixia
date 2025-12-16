const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@fixia.app';
    const password = 'Admin123!';
    const name = 'Administrator';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', email);
      console.log('User ID:', existingAdmin.id);
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        completedOnboarding: true,
        subscriptionStatus: 'active',
        subscriptionEndsAt: new Date('2099-12-31'),
        listingVisible: false,
        canCreateServices: false,
        canReceiveBookings: false
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔐 Password:', password);
    console.log('👤 User ID:', admin.id);
    console.log('');
    console.log('⚠️  IMPORTANT: Store these credentials safely and change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
