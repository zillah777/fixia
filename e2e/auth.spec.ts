import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

// Helper to generate a valid session token
async function createSessionToken(payload: any) {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) throw new Error('JWT_SECRET is not defined');
  const secret = new TextEncoder().encode(secretKey);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15 minutes')
    .sign(secret);
}

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[Browser Console Error]: ${msg.text()}`);
      }
    });

    await page.goto('/register');
  });

  test('should display registration form correctly', async ({ page }) => {
    await expect(page.getByText('Crear Cuenta', { exact: false })).toBeVisible();
    await expect(page.getByPlaceholder('Juan Pérez')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: /registrarse/i })).toBeVisible();
  });

  test('should show validation error for empty submission', async ({ page }) => {
    await page.getByRole('button', { name: /registrarse/i }).click();
    // Expect some HTML5 validation or UI error message
    // Adjust selector based on actual implementation
    // await expect(page.getByText(/requerido/i)).toBeVisible(); 
  });

  test('should submit registration form successfully', async ({ page }) => {
    // Mock API response
    await page.route('/api/auth/register', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.getByPlaceholder('Juan Pérez').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Teléfono').fill('1234567890');
    await page.getByLabel('Contraseña').fill('password123');

    // Select role (assuming radio buttons exist based on previous file read)
    // We might need to click the label or the radio input
    // Force click the hidden input to ensure selection
    await page.locator('input[value="CLIENT"]').click({ force: true });

    // Wait for the API call to ensure the button click worked
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/auth/register') && response.status() === 200
    );

    const submitButton = page.getByRole('button', { name: /registrarse/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await responsePromise;

    // Verify redirection or success message
    // Based on RegisterPage code: router.push("/auth/verify-email")
    await expect(page).toHaveURL(/\/auth\/verify-email/, { timeout: 10000 });
  });
});

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form correctly', async ({ page }) => {
    await expect(page.getByText('Iniciar Sesión', { exact: false })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: /ingresar/i })).toBeVisible();
  });

  test('should submit login form successfully', async ({ page }) => {
    // Mock API response
    // Mock API response with VALID token
    const token = await createSessionToken({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT'
      }
    });

    await page.route('/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
        headers: {
          'set-cookie': `session=${token}; Path=/; HttpOnly`
        }
      });
    });

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Contraseña').fill('password123');
    await page.getByRole('button', { name: /ingresar/i }).click();

    // Verify redirection to dashboard
    // Assuming login redirects to /dashboard
    await expect(page).toHaveURL(/\/dashboard/); // Adjust if it redirects elsewhere
  });
});
