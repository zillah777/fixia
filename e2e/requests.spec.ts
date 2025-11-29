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

test.describe('Service Request Flow', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Generate valid session token
        const token = await createSessionToken({
            user: {
                id: 'test-user-id',
                email: 'client@example.com',
                name: 'Test Client',
                role: 'CLIENT'
            }
        });

        // 2. Mock Login API
        await page.route('/api/auth/login', async route => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true }),
                headers: {
                    'set-cookie': `session=${token}; Path=/; HttpOnly`
                }
            });
        });

        // 3. Perform Login
        await page.goto('/login');
        await page.getByLabel('Email').fill('client@example.com');
        await page.getByLabel('Contraseña').fill('password123');
        await page.getByRole('button', { name: /ingresar/i }).click();

        // Wait for dashboard or redirection
        await expect(page).toHaveURL(/\/dashboard/);

        // 4. Navigate to create request page
        await page.goto('/dashboard/requests/create');
    });

    test('should render all form fields correctly', async ({ page }) => {
        // Verify we are on the correct page (not redirected to login)
        await expect(page).toHaveURL(/\/dashboard\/requests\/create/);

        await expect(page.getByRole('heading', { name: /nueva solicitud/i })).toBeVisible();
        await expect(page.getByLabel(/título de la solicitud/i)).toBeVisible();
        await expect(page.getByText(/categoría/i)).toBeVisible();
        await expect(page.getByLabel(/ubicación/i)).toBeVisible();
        await expect(page.getByLabel(/descripción detallada/i)).toBeVisible();
        await expect(page.getByText(/fecha preferida/i)).toBeVisible();
        await expect(page.getByText(/presupuesto estimado/i)).toBeVisible();
    });

    test('should show validation errors for empty submission', async ({ page }) => {
        await page.getByRole('button', { name: /publicar solicitud/i }).click();

        // Check for HTML5 validation or UI error messages
        await expect(page.getByText(/el título debe tener al menos/i)).toBeVisible();
        await expect(page.getByText(/selecciona una categoría/i)).toBeVisible();
        await expect(page.getByText(/ingresa una dirección válida/i)).toBeVisible();
    });

    test('should submit request successfully with valid data', async ({ page }) => {
        // Fill form
        await page.getByLabel(/título de la solicitud/i).fill('Reparación de Cañería');

        // Select Category (Radix UI Select)
        await page.getByRole('combobox').click();
        // Use getByLabel or getByRole option
        await page.getByRole('option', { name: 'Plomería' }).click();

        await page.getByLabel(/ubicación/i).fill('Av. Corrientes 1234, CABA');
        await page.getByLabel(/descripción detallada/i).fill('Tengo una pérdida de agua en el baño principal que necesita reparación urgente.');

        // Select Date (Calendar)
        await page.getByRole('button', { name: /selecciona una fecha/i }).click();
        // Click the first enabled day in the calendar
        await page.getByRole('gridcell', { disabled: false }).first().click();

        // Budget is a slider, default is 5000. We can leave it or drag it.

        // Wait for the simulated API call (setTimeout 1500ms in component)
        // Since it's a simulated delay, we can just wait for the URL change or success toast
        // But to be safe, we can wait for the button to be disabled or loading state?
        // The component sets isLoading(true).

        await page.getByRole('button', { name: /publicar solicitud/i }).click();

        // Verify Success Toast
        await expect(page.getByText(/solicitud publicada exitosamente/i)).toBeVisible();

        // Verify Redirection
        await expect(page).toHaveURL(/\/dashboard\/requests/, { timeout: 10000 });
    });
});
