/**
 * Script: Create Test Professional Account
 *
 * Usage:
 * npx ts-node scripts/create-test-professional.ts
 *
 * This script creates a fully-enabled professional account for testing
 * without requiring MercadoPago payment.
 */

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface TestProfessionalInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dni?: string;
  category?: string;
}

async function createTestProfessional(input: TestProfessionalInput) {
  try {
    console.log('🔧 Creating test professional account...');

    const {
      name,
      email,
      password,
      phone = '1234567890',
      dni = '12345678',
      category = 'plomeria',
    } = input;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }, { dni }],
      },
    });

    if (existingUser) {
      console.error(
        `❌ User already exists with this ${existingUser.email === email ? 'email' : 'phone'}`
      );
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create professional user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'PROFESSIONAL',
        phone,
        dni,
        birthdate: new Date('1990-01-01'),
        status: 'VERIFIED',
        // Enable all features for testing
        canCreateServices: true,
        listingVisible: true,
        canReceiveBookings: true,
        subscriptionPlan: 'PROFESSIONAL',
        subscriptionStatus: 'ACTIVE',
        subscriptionEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        // Create profile
        profile: {
          create: {
            category,
            yearsExperience: 5,
            workRadius: 'Mi ciudad',
            availability: JSON.stringify({
              monday: { start: '09:00', end: '18:00' },
              tuesday: { start: '09:00', end: '18:00' },
              wednesday: { start: '09:00', end: '18:00' },
              thursday: { start: '09:00', end: '18:00' },
              friday: { start: '09:00', end: '18:00' },
              saturday: { start: '09:00', end: '13:00' },
            }),
            tags: JSON.stringify(['testing', 'development']),
            badges: JSON.stringify([
              {
                id: 'verified',
                name: 'Verificado',
                icon: 'shield-check',
                color: 'green',
              },
            ]),
            rating: 5,
            reviews: 0,
            responseTime: '< 1 hora',
            completedJobs: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log('✅ Test professional created successfully!\n');
    console.log('📋 Account Details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Category: ${category}`);
    console.log(`   ID: ${user.id}\n`);
    console.log('🎯 Features Enabled:');
    console.log(`   ✓ Can Create Services: ${user.canCreateServices}`);
    console.log(`   ✓ Listing Visible: ${user.listingVisible}`);
    console.log(`   ✓ Can Receive Bookings: ${user.canReceiveBookings}`);
    console.log(`   ✓ Subscription Status: ${user.subscriptionStatus}`);
    console.log(`   ✓ Verified Badge: Yes\n`);
    console.log('🌐 Next steps:');
    console.log(`   1. Visit https://fixia.app/login`);
    console.log(`   2. Login with: ${user.email} / ${password}`);
    console.log(`   3. Go to Dashboard → Services to create service listings`);
    console.log(`   4. Visit /professionals/${user.id} to see your profile\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test professional:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage - customize as needed
const testProfessional: TestProfessionalInput = {
  name: 'Plomero Test',
  email: 'plomero@test.com',
  password: 'Test123456!',
  phone: '1234567890',
  dni: '12345678',
  category: 'plomeria',
};

createTestProfessional(testProfessional);
