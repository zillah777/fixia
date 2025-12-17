# 🚀 Quick Start: Create Test Professional Account

## ⚡ 30 Second Setup

### Using cURL (Fastest)

```bash
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plomero Test",
    "email": "plomero@test.com",
    "password": "Test123456!",
    "category": "plomeria"
  }'
```

**Copy the response and save credentials**

---

## 🎯 What You Get

✅ Full professional account ready for testing
✅ All features enabled (create services, receive bookings)
✅ VERIFIED badge included
✅ Active 1-year subscription
✅ No email verification required
✅ No payment required

---

## 📋 Account Details

After creation, you'll get a response like:

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
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
  }
}
```

---

## 🔐 Login to Your Test Account

1. Go to **https://fixia.app/login**
2. Enter:
   - Email: `plomero@test.com`
   - Password: `Test123456!`
3. Click Login ✓

You're now logged in as a professional!

---

## 🛠️ Test the Professional Features

### 1. Create a Service (2 minutes)
- Click **Dashboard** → **Services**
- Click **"Crear Nuevo Servicio"**
- Fill in service details
- Click Save

### 2. View Your Profile (1 minute)
- Go to `/professionals/{your-id}`
- Verify your VERIFIED badge shows
- See your services listed

### 3. Search in Marketplace (1 minute)
- Go to `/professionals`
- Search for your name
- Verify you appear in results

### 4. Receive a Booking (3 minutes)
- Create another CLIENT account (separate browser/incognito)
- From client account, find your professional
- Click "Ver Perfil"
- Create a booking request

---

## 📱 Available Categories

Use any of these for the `category` parameter:

```
"plomeria"      → Plumbing
"electricidad"  → Electricity
"gas"           → Gas services
"pintura"       → Painting
"carpinteria"   → Carpentry
"fletes"        → Moving/Transport
"belleza"       → Beauty
"tecnologia"    → Technology
"jardineria"    → Gardening
"albanileria"   → Masonry
```

---

## 🔄 Create Multiple Test Accounts

### Option 1: Different Categories
```bash
# Electrician
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{"name":"Electricista Test","email":"electricista@test.com","password":"Test123456!","category":"electricidad"}'

# Painter
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{"name":"Pintor Test","email":"pintor@test.com","password":"Test123456!","category":"pintura"}'
```

### Option 2: Using TypeScript Script
```bash
npx ts-node scripts/create-test-professional.ts
```

Edit the script to customize account details.

---

## 🎬 Complete Testing Workflow

### Step 1: Create Professional Account
```bash
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Professional","email":"pro@test.com","password":"Test123456!","category":"plomeria"}'
```

### Step 2: Login as Professional
- Visit https://fixia.app/login
- Email: `pro@test.com`
- Password: `Test123456!`

### Step 3: Create Service
- Dashboard → Services → Create New
- Title: "Reparación de Tuberías"
- Description: "Reparación rápida y segura"
- Price: "$500 - $1000"
- Save

### Step 4: Create Client Account
- Open incognito/private window
- Register as CLIENT at https://fixia.app/register
- Verify email (check console if using dev setup)

### Step 5: Client Searches for Professional
- Go to https://fixia.app/professionals
- Search for "Test Professional" or your name
- Click on your profile card

### Step 6: Client Requests Booking
- Click "Ver Perfil"
- Click "Solicitar Servicio"
- Fill booking details
- Submit request

### Step 7: Professional Accepts Booking
- Switch back to professional account
- Go to Dashboard → Opportunities
- Find the booking request
- Accept or reject

### Step 8: Complete the Booking
- Mark as completed
- Leave review (optional)

---

## ⚙️ Environment Setup

Make sure you have:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Your app runs at http://localhost:3000
```

**Important**: The endpoint only works with `NODE_ENV=development`

---

## 🚨 Troubleshooting

### Error: "This endpoint is only available in development"
```bash
# Make sure you're running in development
NODE_ENV=development npm run dev
```

### Error: "User already exists"
```bash
# Use a unique email each time
email: `pro-${Date.now()}@test.com`
```

### Error: "Password too short"
```bash
# Use at least 6 characters
password: "Test123456!" ✓
```

---

## 📊 What Gets Created

### User Record
- ✓ Role: PROFESSIONAL
- ✓ Status: VERIFIED (no email needed)
- ✓ Subscription: ACTIVE (1 year)

### Permissions Enabled
- ✓ Can create service listings
- ✓ Listing visible in marketplace
- ✓ Can receive booking requests
- ✓ VERIFIED badge on profile

### Professional Profile
- ✓ Category: [Your chosen category]
- ✓ Years Experience: 5
- ✓ Rating: 5 stars
- ✓ Response time: < 1 hour
- ✓ Work hours: Mon-Fri 9-18, Sat 9-13

---

## 🔗 Useful Links

- **Login**: https://fixia.app/login
- **Dashboard**: https://fixia.app/dashboard
- **Professionals List**: https://fixia.app/professionals
- **Services List**: https://fixia.app/services
- **Your Profile**: https://fixia.app/professionals/{user-id}

---

## 💡 Pro Tips

1. **Test in Incognito Mode**
   - Open 2 incognito windows
   - One logged as PROFESSIONAL, one as CLIENT
   - Easy to test both sides of the flow

2. **Use Different Emails**
   - Each account needs unique email
   - Use timestamps: `pro-${Date.now()}@test.com`

3. **Test with Real Mobile**
   - Don't just use DevTools mobile view
   - Test the responsive design on actual phone

4. **Create Multiple Professionals**
   - Create professionals in different categories
   - Test search and filtering features
   - Verify professional rankings

---

## 🔒 Security Notes

⚠️ **This is development-only**

- ✋ Endpoint blocked in production
- ✋ Only for local testing
- ✋ Never deploy to live servers
- ✋ Passwords returned in plain text (dev only)

In production, users must:
1. Register normally
2. Verify email
3. Complete identity verification
4. Pay via MercadoPago

---

## 📚 For More Details

See: [DEV_TEST_PROFESSIONAL_GUIDE.md](DEV_TEST_PROFESSIONAL_GUIDE.md)

This quick guide covers the basics. The full guide has:
- Advanced testing scenarios
- Batch account creation
- Direct database queries
- Integration testing examples
- Cleanup procedures

---

## ✨ You're All Set!

**Next Steps**:
1. Create your test professional account
2. Login to the dashboard
3. Create a test service
4. Test the complete booking flow

Happy testing! 🎉
