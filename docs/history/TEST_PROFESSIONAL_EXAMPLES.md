# Test Professional Account Examples

Ready-to-use examples for creating test professionals in different scenarios.

---

## Example 1: Basic Plumber Account

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Plomero",
    "email": "juan@plomeria.test",
    "password": "SecurePass123!",
    "phone": "1234567890",
    "dni": "12345678",
    "category": "plomeria"
  }'
```

### Using JavaScript:
```javascript
async function createPlumber() {
  const response = await fetch('/api/dev/create-test-professional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Juan Plomero',
      email: 'juan@plomeria.test',
      password: 'SecurePass123!',
      phone: '1234567890',
      dni: '12345678',
      category: 'plomeria',
    }),
  });

  const data = await response.json();
  console.log('Plumber created:', data.user.email);
  console.log('Login with:', data.credentials);
}

createPlumber();
```

### Login Credentials:
```
Email: juan@plomeria.test
Password: SecurePass123!
```

---

## Example 2: Electrician with High Rating

```bash
curl -X POST http://localhost:3000/api/dev/create-test-professional \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Electricista",
    "email": "carlos@electricidad.test",
    "password": "ElectricalWork2024!",
    "phone": "9876543210",
    "dni": "87654321",
    "category": "electricidad"
  }'
```

---

## Example 3: Multiple Professionals (Batch Create)

### JavaScript Batch Script:
```javascript
async function createMultipleProfessionals() {
  const professionals = [
    {
      name: 'Plomero Test',
      email: 'plomero@test.com',
      password: 'Test123456!',
      category: 'plomeria',
    },
    {
      name: 'Electricista Test',
      email: 'electricista@test.com',
      password: 'Test123456!',
      category: 'electricidad',
    },
    {
      name: 'Pintor Test',
      email: 'pintor@test.com',
      password: 'Test123456!',
      category: 'pintura',
    },
    {
      name: 'Carpintero Test',
      email: 'carpintero@test.com',
      password: 'Test123456!',
      category: 'carpinteria',
    },
  ];

  const accounts = [];

  for (const pro of professionals) {
    const response = await fetch('/api/dev/create-test-professional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pro),
    });

    const data = await response.json();
    accounts.push({
      name: data.user.name,
      email: data.user.email,
      password: pro.password,
      category: pro.category,
    });

    console.log(`✅ Created: ${data.user.name} (${data.user.email})`);
  }

  // Save accounts for reference
  console.log('\n📋 Created Accounts:');
  console.table(accounts);

  return accounts;
}

createMultipleProfessionals();
```

### Output:
```
✅ Created: Plomero Test (plomero@test.com)
✅ Created: Electricista Test (electricista@test.com)
✅ Created: Pintor Test (pintor@test.com)
✅ Created: Carpintero Test (carpintero@test.com)

📋 Created Accounts:
┌─────────────┬────────────────────────────┬──────────────┬──────────────┐
│ name        │ email                      │ password     │ category     │
├─────────────┼────────────────────────────┼──────────────┼──────────────┤
│ Plomero...  │ plomero@test.com           │ Test123456!  │ plomeria     │
│ Electricis..│ electricista@test.com      │ Test123456!  │ electricidad │
│ Pintor Test │ pintor@test.com            │ Test123456!  │ pintura      │
│ Carpintero..│ carpintero@test.com        │ Test123456!  │ carpinteria  │
└─────────────┴────────────────────────────┴──────────────┴──────────────┘
```

---

## Example 4: Testing Search Functionality

### Create 5 Professionals in Same Category:
```javascript
async function createMultiplePlumbersForSearch() {
  const names = [
    'Plomero del Sur',
    'Plomería Express',
    'Plomero Profesional',
    'Servicio de Plomería',
    'Plomería 24 Horas',
  ];

  for (let i = 0; i < names.length; i++) {
    await fetch('/api/dev/create-test-professional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: names[i],
        email: `plomero-${i}@test.com`,
        password: 'Test123456!',
        phone: `123456789${i}`,
        dni: `1234567${i}`,
        category: 'plomeria',
      }),
    });
  }

  console.log('✅ Created 5 plumbers for search testing');
}

createMultiplePlumbersForSearch();
```

**Then test search:**
1. Go to https://fixia.app/professionals
2. Search for "Plomería"
3. All 5 should appear
4. Filter by category "Plomería"
5. Verify results

---

## Example 5: Testing Booking Flow End-to-End

```javascript
async function testBookingFlow() {
  console.log('🔄 Starting booking flow test...\n');

  // Step 1: Create Professional
  console.log('1️⃣ Creating professional account...');
  const proResponse = await fetch('/api/dev/create-test-professional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Professional',
      email: `pro-${Date.now()}@test.com`,
      password: 'ProTest123!',
      category: 'plomeria',
    }),
  });

  const proData = await proResponse.json();
  const professionalId = proData.user.id;
  console.log(`✅ Professional created: ${proData.user.name}`);
  console.log(`   ID: ${professionalId}`);
  console.log(`   Email: ${proData.user.email}\n`);

  // Step 2: Login as Professional
  console.log('2️⃣ Login with professional credentials:');
  console.log(`   Email: ${proData.credentials.email}`);
  console.log(`   Password: ${proData.credentials.password}\n`);

  // Step 3: Create Service
  console.log('3️⃣ Create a service listing in dashboard:');
  console.log(`   Go to: https://fixia.app/dashboard/services`);
  console.log(`   Create service for category: plomeria\n`);

  // Step 4: Create Client Account
  console.log('4️⃣ Create client account (incognito/new browser):');
  const clientEmail = `client-${Date.now()}@test.com`;
  console.log(`   Email: ${clientEmail}`);
  console.log(`   Password: ClientTest123!\n`);

  // Step 5: Client Finds Professional
  console.log('5️⃣ Client searches for professional:');
  console.log(`   Go to: https://fixia.app/professionals`);
  console.log(`   Search for: "Test Professional"\n`);

  // Step 6: Booking Request
  console.log('6️⃣ Client creates booking request:');
  console.log(`   Click on professional profile`);
  console.log(`   Click "Ver Perfil"`);
  console.log(`   Click "Solicitar Servicio"`);
  console.log(`   Fill in booking details\n`);

  // Step 7: Professional Reviews
  console.log('7️⃣ Professional reviews booking:');
  console.log(`   Go to: https://fixia.app/dashboard/opportunities`);
  console.log(`   Find booking request`);
  console.log(`   Accept or reject\n`);

  console.log('✨ Booking flow test complete!\n');
}

testBookingFlow();
```

**Output:**
```
🔄 Starting booking flow test...

1️⃣ Creating professional account...
✅ Professional created: Test Professional
   ID: 550e8400-e29b-41d4-a716-446655440000
   Email: pro-1703001234567@test.com

2️⃣ Login with professional credentials:
   Email: pro-1703001234567@test.com
   Password: ProTest123!

3️⃣ Create a service listing in dashboard:
   Go to: https://fixia.app/dashboard/services
   Create service for category: plomeria

4️⃣ Create client account (incognito/new browser):
   Email: client-1703001234567@test.com
   Password: ClientTest123!

5️⃣ Client searches for professional:
   Go to: https://fixia.app/professionals
   Search for: "Test Professional"

6️⃣ Client creates booking request:
   Click on professional profile
   Click "Ver Perfil"
   Click "Solicitar Servicio"
   Fill in booking details

7️⃣ Professional reviews booking:
   Go to: https://fixia.app/dashboard/opportunities
   Find booking request
   Accept or reject

✨ Booking flow test complete!
```

---

## Example 6: Testing Different Categories

```javascript
const categories = {
  plomeria: 'Reparación de tuberías y grifería',
  electricidad: 'Instalación y reparación eléctrica',
  gas: 'Servicio de gas e instalación',
  pintura: 'Pintura de interiores y exteriores',
  carpinteria: 'Carpintería y ebanistería',
  fletes: 'Transporte y mudanzas',
  belleza: 'Peluquería y servicios de estética',
  tecnologia: 'Reparación de dispositivos',
  jardineria: 'Jardinería y paisajismo',
  albanileria: 'Albañilería y construcción',
};

async function testAllCategories() {
  console.log('🏢 Testing all professional categories...\n');

  for (const [category, description] of Object.entries(categories)) {
    const response = await fetch('/api/dev/create-test-professional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Professional ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        email: `${category}@test.com`,
        password: 'Test123456!',
        category,
      }),
    });

    const data = await response.json();
    console.log(`✅ ${category.padEnd(15)} | ${data.user.email}`);
  }

  console.log('\n✨ All categories tested!');
  console.log('\n🔍 Go to /professionals to verify all categories show up\n');
}

testAllCategories();
```

---

## Example 7: Testing with Cypress/Playwright

### Cypress Test:
```javascript
describe('Professional Account Creation', () => {
  it('should create a professional and complete booking flow', () => {
    let professionalId;

    // Create professional
    cy.request('POST', '/api/dev/create-test-professional', {
      name: 'Test Professional',
      email: `pro-${Date.now()}@test.com`,
      password: 'TestPass123!',
      category: 'plomeria',
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.user.canCreateServices).to.equal(true);
      professionalId = response.body.user.id;
    });

    // Login as professional
    cy.visit('/login');
    cy.get('input[type="email"]').type('pro@test.com');
    cy.get('input[type="password"]').type('TestPass123!');
    cy.get('button:contains("Ingresar")').click();

    // Create service
    cy.visit('/dashboard/services');
    cy.get('button:contains("Crear Nuevo Servicio")').click();
    cy.get('input[name="title"]').type('Reparación de Tuberías');
    cy.get('textarea[name="description"]').type('Servicio de reparación rápida');
    cy.get('input[name="price"]').type('500');
    cy.get('button:contains("Guardar")').click();

    // Verify service created
    cy.contains('Servicio creado exitosamente').should('be.visible');
  });
});
```

---

## Example 8: Load Testing with Multiple Accounts

```javascript
async function createMultipleAccountsForLoadTest(count = 10) {
  console.log(`🚀 Creating ${count} test professional accounts for load testing...\n`);

  const accounts = [];
  const startTime = Date.now();

  for (let i = 0; i < count; i++) {
    try {
      const response = await fetch('/api/dev/create-test-professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Load Test Professional ${i + 1}`,
          email: `loadtest-${i}-${Date.now()}@test.com`,
          password: 'LoadTest123!',
          phone: `1234567${String(i).padStart(3, '0')}`,
          dni: `1234567${String(i).padStart(3, '0')}`,
          category: ['plomeria', 'electricidad', 'gas', 'pintura'][i % 4],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        accounts.push(data.user.email);
        console.log(`✅ [${i + 1}/${count}] Created: ${data.user.email}`);
      } else {
        console.error(`❌ [${i + 1}/${count}] Failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ [${i + 1}/${count}] Error: ${error.message}`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const avgTime = (duration / count).toFixed(2);

  console.log(`\n📊 Results:`);
  console.log(`   Total: ${count} accounts`);
  console.log(`   Created: ${accounts.length} accounts`);
  console.log(`   Duration: ${duration}s`);
  console.log(`   Average: ${avgTime}s per account`);

  return accounts;
}

createMultipleAccountsForLoadTest(20);
```

---

## Example 9: Testing with Environment Variables

### Create `.env.test` file:
```env
TEST_PROFESSIONAL_NAME=Test Professional
TEST_PROFESSIONAL_EMAIL=test-pro@test.com
TEST_PROFESSIONAL_PASSWORD=SecureTest123!
TEST_PROFESSIONAL_CATEGORY=plomeria
TEST_CLIENT_EMAIL=test-client@test.com
TEST_CLIENT_PASSWORD=SecureTest123!
```

### Use in tests:
```javascript
async function createTestAccountsFromEnv() {
  const proResponse = await fetch('/api/dev/create-test-professional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: process.env.TEST_PROFESSIONAL_NAME,
      email: process.env.TEST_PROFESSIONAL_EMAIL,
      password: process.env.TEST_PROFESSIONAL_PASSWORD,
      category: process.env.TEST_PROFESSIONAL_CATEGORY,
    }),
  });

  return await proResponse.json();
}
```

---

## Example 10: API Integration Tests

```javascript
describe('Professional API Integration', () => {
  let authToken;
  let professionalId;

  beforeAll(async () => {
    // Create professional
    const createResponse = await fetch('/api/dev/create-test-professional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Test Pro',
        email: `integration-${Date.now()}@test.com`,
        password: 'IntegrationTest123!',
        category: 'plomeria',
      }),
    });

    const data = await createResponse.json();
    professionalId = data.user.id;
  });

  it('should fetch professional profile', async () => {
    const response = await fetch(`/api/professionals/${professionalId}`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.role).toBe('PROFESSIONAL');
    expect(data.canCreateServices).toBe(true);
  });

  it('should list professional in marketplace', async () => {
    const response = await fetch('/api/professionals?category=plomeria');
    expect(response.status).toBe(200);

    const data = await response.json();
    const found = data.data.find((p) => p.id === professionalId);
    expect(found).toBeDefined();
  });

  it('should allow creating services', async () => {
    // Login first
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `integration-${Date.now()}@test.com`,
        password: 'IntegrationTest123!',
      }),
    });

    authToken = loginResponse.headers.get('set-cookie');

    // Create service
    const serviceResponse = await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authToken,
      },
      body: JSON.stringify({
        title: 'Test Service',
        description: 'Test description',
        price: 500,
        category: 'plomeria',
      }),
    });

    expect(serviceResponse.status).toBe(201);
  });
});
```

---

## 🎯 Choose Your Use Case

| Scenario | Example | Use |
|----------|---------|-----|
| Quick test | Example 1 | One-off testing |
| Multiple categories | Example 4 | Test search |
| Complete booking flow | Example 5 | Full workflow |
| Load testing | Example 8 | Performance |
| Automated tests | Example 10 | CI/CD |

---

## 📖 For More Examples

- See [DEV_TEST_PROFESSIONAL_GUIDE.md](DEV_TEST_PROFESSIONAL_GUIDE.md) for comprehensive documentation
- See [QUICK_START_TEST_PROFESSIONAL.md](QUICK_START_TEST_PROFESSIONAL.md) for quick reference
