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
    test.beforeEach(async ({ page, context }) => {
        // 1. Generate valid session token
        const token = await createSessionToken({
            user: {
                id: 'test-user-id',
                email: 'client@example.com',
                name: 'Test Client',
                role: 'CLIENT'
            }
        });

        // 2. Set cookie to bypass login
        await context.addCookies([{
            name: 'session',
            value: token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
        }]);

        // 3. Navigate to create request page
        await page.goto('/dashboard/requests/create');
    });

    test('should render all form fields correctly', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /nueva solicitud/i })).toBeVisible();
        await expect(page.getByLabel(/título de la solicitud/i)).toBeVisible();
        await expect(page.getByText(/categoría/i)).toBeVisible(); // Select trigger
        await expect(page.getByLabel(/ubicación/i)).toBeVisible();
        await expect(page.getByLabel(/descripción detallada/i)).toBeVisible();
        await expect(page.getByText(/fecha preferida/i)).toBeVisible();
        await expect(page.getByText(/presupuesto estimado/i)).toBeVisible();
    });

    test('should show validation errors for empty submission', async ({ page }) => {
        await page.getByRole('button', { name: /publicar solicitud/i }).click();

        // Check for HTML5 validation or UI error messages
        // Since we use Zod resolver, errors should appear in the UI
        await expect(page.getByText(/el título debe tener al menos/i)).toBeVisible();
        await expect(page.getByText(/selecciona una categoría/i)).toBeVisible();
        await expect(page.getByText(/ingresa una dirección válida/i)).toBeVisible();
    });

    test('should submit request successfully with valid data', async ({ page }) => {
        // Fill form
        await page.getByLabel(/título de la solicitud/i).fill('Reparación de Cañería');

        // Select Category (Radix UI Select)
        await page.getByRole('combobox').click();
        await page.getByLabel('Plomería').click();

        await page.getByLabel(/ubicación/i).fill('Av. Corrientes 1234, CABA');
        await page.getByLabel(/descripción detallada/i).fill('Tengo una pérdida de agua en el baño principal que necesita reparación urgente.');

        // Select Date (Calendar)
        await page.getByRole('button', { name: /selecciona una fecha/i }).click();
        // Click today or tomorrow. Just picking the first available day in the calendar grid usually works
        // or specifically targeting a date.
        // Let's just click the "next month" button to be safe and pick a day, or just pick a visible day.
        // Assuming the calendar opens to current month.
        const today = new Date();
        const day = today.getDate();
        // Simple hack: press Enter to select focused date (usually today) or click a specific day
        await page.keyboard.press('Enter');

        // Budget is a slider, default is 5000. We can leave it or drag it.
        // Leaving it as is for now.

        // Submit
        await page.getByRole('button', { name: /publicar solicitud/i }).click();

        // Verify Success
        await expect(page.getByText(/solicitud publicada exitosamente/i)).toBeVisible();

        // Verify Redirection
        await expect(page).toHaveURL(/\/dashboard\/requests/);
    });
});
