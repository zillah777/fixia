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

test.describe('Profile Flow', () => {
    const testUser = {
        id: 'test-user-id',
        email: 'client@example.com',
        name: 'Test Client',
        role: 'CLIENT'
    };

    test.beforeEach(async ({ page }) => {
        // 1. Generate valid session token
        const token = await createSessionToken({ user: testUser });

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

        // 4. Navigate to profile page
        await page.goto('/dashboard/profile');
    });

    test('should display correct user information', async ({ page }) => {
        // DIAGNOSIS: This should fail if the page uses hardcoded "Juan Pérez"
        await expect(page.getByRole('heading', { name: testUser.name })).toBeVisible();
        await expect(page.getByText(testUser.email)).toBeVisible();
    });

    test('should allow editing profile', async ({ page }) => {
        // Click Edit
        await page.getByRole('button', { name: /editar perfil/i }).click();

        // Change Name
        const newName = 'Updated Name';
        await page.getByLabel(/nombre completo/i).fill(newName);

        // Save
        await page.getByRole('button', { name: /guardar cambios/i }).click();

        // Verify Success Toast
        await expect(page.getByText(/perfil actualizado correctamente/i)).toBeVisible();

        // Verify new name is displayed (persisted in UI state at least)
        await expect(page.getByRole('heading', { name: newName })).toBeVisible();
    });
});
