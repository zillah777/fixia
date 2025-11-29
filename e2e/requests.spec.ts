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
        await page.getByLabel('Título').fill('Reparación de Cañería');

        // Select Category - Ensure visibility
        const categorySelect = page.getByRole('combobox');
        await categorySelect.scrollIntoViewIfNeeded();
        await categorySelect.click();
        await page.getByRole('option', { name: 'Plomería' }).click();

        // Location & Description
        await page.getByLabel('Ubicación').fill('Av. Corrientes 1234');
        await page.getByLabel('Descripción').fill('Tengo una pérdida de agua en la cocina.');

        // Date Selection - Handle mobile visibility
        const dateButton = page.getByRole('button', { name: /seleccionar fecha/i });
        await dateButton.scrollIntoViewIfNeeded();
        await dateButton.click();

        // Force click on date cell if needed (mobile calendars can be tricky)
        const dateCell = page.getByRole('gridcell', { disabled: false }).first();
        await expect(dateCell).toBeVisible();
        await dateCell.click({ force: true });

        // Submit - Ensure button is visible
        const submitButton = page.getByRole('button', { name: /publicar solicitud/i });
        await submitButton.scrollIntoViewIfNeeded();

        // Wait for response to avoid race conditions
        const [response] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/requests') && res.status() === 200),
            submitButton.click()
        ]);

        // Verify Success Toast - Increased timeout
        await expect(page.getByText(/solicitud creada exitosamente/i)).toBeVisible({ timeout: 15000 });

        // Verify Redirection
        await expect(page).toHaveURL(/\/dashboard\/requests/);
    });
});
