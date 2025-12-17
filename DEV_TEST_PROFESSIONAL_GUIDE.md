# Development Guide: Creating Test Professional Accounts

## Overview

This guide explains how to create fully-enabled professional test accounts **without requiring MercadoPago payment**. Perfect for testing the complete professional workflow.

---

## Option 1: Using the API Endpoint (Fastest)

### Setup

The endpoint is only available in **development mode** (`NODE_ENV !== 'production'`).

### Create a Test Professional via HTTP

**Endpoint**: `POST /api/dev/create-test-professional`

**Request Body**:
```json
{
  "name": "Plomero Test",
  "email": "plomero@test.com",
  "password": "Test123456!",
  "phone": "1234567890",
  "dni": "12345678",
  "birthdate": "1990-01-01",
  "category": "plomeria"
}
```

**Available Categories**:
- `plomeria` - Plumbing
- `electricidad` - Electricity
- `gas` - Gas services
- `pintura` - Painting
- `carpinteria` - Carpentry
- `fletes` - Moving/Transport
- `belleza` - Beauty services
- `tecnologia` - Technology
- `jardineria` - Gardening
- `albanileria` - Masonry

### Using cURL:

```bash
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plomero Test",
    "email": "plomero@test.com",
    "password": "Test123456!",
    "phone": "1234567890",
    "dni": "12345678",
    "category": "plomeria"
  }'
```

### Using JavaScript/Fetch:

```javascript
const response = await fetch('/api/dev/create-test-professional', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Plomero Test',
    email: 'plomero@test.com',
    password: 'Test123456!',
    phone: '1234567890',
    dni: '12345678',
    category: 'plomeria',
  }),
});

const data = await response.json();
console.log('Created professional:', data.user);
```

### Response:

```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "name": "Plomero Test",
    "email": "plomero@test.com",
    "role": "PROFESSIONAL",
    "canCreateServices": true,
    "listingVisible": true,
    "canReceiveBookings": true,
    "subscriptionStatus": "ACTIVE"
  },
  "credentials": {
    "email": "plomero@test.com",
    "password": "Test123456!"
  },
  "note": "This is a development test account with all professional features enabled."
}
```

### What Gets Created:

✅ **User Account**
- Role: PROFESSIONAL
- Status: VERIFIED (no email verification needed)
- Email verified automatically

✅ **Features Enabled**
- Can create service listings
- Listing visible in marketplace
- Can receive bookings
- Active subscription (1 year validity)

✅ **Professional Profile**
- Category assigned (plomeria, electricidad, etc.)
- 5 years experience (default)
- Work hours set (Mon-Fri 9-18, Sat 9-13)
- VERIFIED badge included
- Rating: 5 stars
- Response time: < 1 hour

---

## Option 2: Using the TypeScript Script

### Prerequisites

```bash
npm install -D ts-node @types/node
```

### Run the Script

```bash
npx ts-node scripts/create-test-professional.ts
```

### Customize the Script

Edit `scripts/create-test-professional.ts` and modify the `testProfessional` object:

```typescript
const testProfessional: TestProfessionalInput = {
  name: 'Electricista Test',
  email: 'electricista@test.com',
  password: 'MyPassword123!',
  phone: '9876543210',
  dni: '87654321',
  category: 'electricidad',
};
```

Then run:
```bash
npx ts-node scripts/create-test-professional.ts
```

### Script Output:

```
🔧 Creating test professional account...
✅ Test professional created successfully!

📋 Account Details:
   Name: Plomero Test
   Email: plomero@test.com
   Password: Test123456!
   Role: PROFESSIONAL
   Category: plomeria
   ID: 550e8400-e29b-41d4-a716-446655440000

🎯 Features Enabled:
   ✓ Can Create Services: true
   ✓ Listing Visible: true
   ✓ Can Receive Bookings: true
   ✓ Subscription Status: ACTIVE
   ✓ Verified Badge: Yes

🌐 Next steps:
   1. Visit https://fixia.app/login
   2. Login with: plomero@test.com / Test123456!
   3. Go to Dashboard → Services to create service listings
   4. Visit /professionals/{id} to see your profile
```

---

## Option 3: Direct Database Query (Advanced)

If you prefer to work directly with the database:

### Using PostgreSQL CLI:

```sql
-- Create user
INSERT INTO "User" (
  id, name, email, password, role, phone, dni, birthdate, status,
  "canCreateServices", "listingVisible", "canReceiveBookings",
  "subscriptionPlan", "subscriptionStatus", "subscriptionEndsAt"
) VALUES (
  gen_random_uuid(),
  'Plomero Test',
  'plomero@test.com',
  '$2a$10$...', -- bcrypt hashed password
  'PROFESSIONAL',
  '1234567890',
  '12345678',
  '1990-01-01',
  'VERIFIED',
  true, true, true,
  'PROFESSIONAL',
  'ACTIVE',
  NOW() + INTERVAL '1 year'
);

-- Create profile
INSERT INTO "Profile" (
  id, "userId", category, "yearsExperience", "workRadius",
  availability, tags, badges, rating, reviews
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM "User" WHERE email = 'plomero@test.com'),
  'plomeria',
  5,
  'Mi ciudad',
  '{"monday":{"start":"09:00","end":"18:00"}...}',
  '["testing","development"]',
  '[{"id":"verified","name":"Verificado","color":"green"}]',
  5,
  0
);
```

---

## Testing the Complete Professional Flow

### 1. Login to Your Test Account

1. Go to `https://fixia.app/login`
2. Enter email and password from the created account
3. You should see the dashboard immediately (no email verification)

### 2. Complete Your Profile

1. Navigate to **Dashboard** → **Profile**
2. Add a profile photo (optional)
3. Update services and rates (optional)

### 3. Create Service Listings

1. Go to **Dashboard** → **Services**
2. Click **"Create New Service"**
3. Add service details:
   - Title
   - Description
   - Price
   - Category
   - Tags

### 4. View Your Public Profile

1. Visit `/professionals/{your-id}`
2. Verify your VERIFIED badge is showing
3. Check that your services are visible

### 5. View in Marketplace

1. Go to `/professionals` or `/services`
2. Search for your name or category
3. Your profile should appear in results

### 6. Receive Bookings (Simulated)

1. Create a second CLIENT account for testing
2. From client account, go to `/professionals` and find your test professional
3. Click "Ver Perfil" and try to create a booking request

---

## Complete Test Account Details

### What Each Test Account Includes:

| Feature | Status | Details |
|---------|--------|---------|
| Email Verification | ✅ Verified | No email confirmation needed |
| Payment Required | ✅ Bypassed | Subscription active by default |
| Create Services | ✅ Enabled | Can create unlimited services |
| Receive Bookings | ✅ Enabled | Can receive booking requests |
| Listing Visibility | ✅ Public | Appears in marketplace search |
| VERIFIED Badge | ✅ Included | Shows identity verified badge |
| Subscription | ✅ Active | Valid for 1 year from creation |
| Profile | ✅ Complete | Pre-filled with default values |
| Avatar | ⚠️ Placeholder | Uses default avatar, can be updated |

---

## Troubleshooting

### Error: "This endpoint is only available in development"

**Cause**: You're trying to access the endpoint in production mode.

**Solution**: Make sure `NODE_ENV` is set to `development`:
```bash
NODE_ENV=development npm run dev
```

### Error: "User already exists"

**Cause**: An account with this email, phone, or DNI already exists.

**Solution**: Use a unique email address:
```javascript
email: `plomero-${Date.now()}@test.com`
```

### Error: "Missing required fields"

**Cause**: Missing `name`, `email`, or `password` in request body.

**Solution**: Provide all required fields:
```json
{
  "name": "Professional Name",
  "email": "email@test.com",
  "password": "SecurePassword123!"
}
```

### Subscription Shows as Inactive

**Cause**: The subscription date has passed.

**Solution**: Run the script again - it creates subscriptions valid for 1 year.

---

## Batch Create Multiple Test Accounts

### Using a Loop (JavaScript):

```javascript
async function createMultipleTestAccounts() {
  const categories = ['plomeria', 'electricidad', 'gas', 'pintura'];

  for (const category of categories) {
    const response = await fetch('/api/dev/create-test-professional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Test`,
        email: `${category}@test.com`,
        password: 'Test123456!',
        phone: `123456789${categories.indexOf(category)}`,
        dni: `1234567${categories.indexOf(category)}`,
        category,
      }),
    });

    const data = await response.json();
    console.log(`✅ Created: ${data.user.email}`);
  }
}

createMultipleTestAccounts();
```

### Using a Script:

```bash
for category in plomeria electricidad gas pintura; do
  curl -X POST http://localhost:3000/api/dev/create-test-professional \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"${category} Test\",
      \"email\": \"${category}@test.com\",
      \"password\": \"Test123456!\",
      \"category\": \"${category}\"
    }"
done
```

---

## Security Notes

⚠️ **Development Only**

- This endpoint **only works in development mode** (`NODE_ENV !== 'production'`)
- It automatically blocks in production deployments
- Never deploy this endpoint to production
- Passwords are returned in response for convenience (dev only)
- Uses predictable defaults (same birthdate, experience, etc.)

### Proper Production Equivalent:

In production, professionals should:
1. Register via normal registration flow
2. Verify their email
3. Complete KYC/identity verification
4. Pay subscription via MercadoPago
5. Only then gain full access to features

---

## Environment Variables

Make sure these are set for the test account creation:

```env
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/fixia_dev
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Next Steps After Creating Test Account

### Test User Scenarios:

1. **Service Creation Flow**
   - Create different service listings
   - Upload images (if available)
   - Set pricing

2. **Booking Request Flow**
   - Create a CLIENT account
   - Request booking from the professional
   - Accept/reject requests

3. **Profile Management**
   - Update availability
   - Add portfolio items
   - Modify pricing

4. **Reviews & Ratings**
   - Complete a booking
   - Leave reviews and ratings
   - Verify rating display

### Integration Testing:

```javascript
describe('Professional Account Creation', () => {
  it('should create a test professional with all features enabled', async () => {
    const response = await fetch('/api/dev/create-test-professional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Professional',
        email: `test-${Date.now()}@test.com`,
        password: 'Test123456!',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user.canCreateServices).toBe(true);
    expect(data.user.subscriptionStatus).toBe('ACTIVE');
  });
});
```

---

## Cleanup

### Delete a Test Account:

```sql
DELETE FROM "Profile" WHERE "userId" = 'user-id-here';
DELETE FROM "User" WHERE id = 'user-id-here';
```

Or use Prisma:

```typescript
await prisma.user.delete({
  where: { email: 'plomero@test.com' },
});
```

---

## Summary

| Method | Difficulty | Speed | Best For |
|--------|-----------|-------|----------|
| API Endpoint | Easy | ⚡⚡⚡ | Manual testing, quick setup |
| TypeScript Script | Medium | ⚡⚡ | Automation, CI/CD |
| Database Query | Hard | ⚡ | Direct data manipulation |

**Recommendation**: Start with the **API Endpoint** for quick testing, then use the **Script** for automated test suite setup.

---

## Support

If you encounter issues:

1. Check that `NODE_ENV=development`
2. Verify database connection is working
3. Ensure bcrypt is installed: `npm list bcryptjs`
4. Check logs for detailed error messages

For more details, see the implementation:
- API: [src/app/api/dev/create-test-professional/route.ts](src/app/api/dev/create-test-professional/route.ts)
- Script: [scripts/create-test-professional.ts](scripts/create-test-professional.ts)
