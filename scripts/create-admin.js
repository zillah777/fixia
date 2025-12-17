#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Direct database query using psql in the container
const command = `psql -h db -U postgres -d fixia -c "
INSERT INTO \\\"User\\\" (id, email, name, password, role, status, \\\"completedOnboarding\\\", \\\"subscriptionStatus\\\", \\\"subscriptionEndsAt\\\", \\\"listingVisible\\\", \\\"canCreateServices\\\", \\\"canReceiveBookings\\\", \\\"createdAt\\\", \\\"updatedAt\\\")
VALUES (
  gen_random_uuid(),
  'admin@fixia.app',
  'Admin Fixia',
  '\\$2a\\$10\\$YOHh0ApKJ61iI2hYG1C4TOxL/8tdhk9CEG2q3R2gjvGJjdVsLZMAi',
  'ADMIN',
  'ACTIVE',
  true,
  'active',
  '2099-12-31',
  false,
  false,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
RETURNING id, email, role;
"`;

console.log('Creating admin user...\n');
const proc = spawn('sh', ['-c', command]);

proc.stdout.on('data', (data) => {
  console.log(data.toString());
});

proc.stderr.on('data', (data) => {
  console.error(data.toString());
});

proc.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Admin user created successfully!');
    console.log('📧 Email: admin@fixia.app');
    console.log('🔐 Password: admin123');
  } else {
    console.error('\n❌ Error creating admin user');
  }
  process.exit(code);
});
