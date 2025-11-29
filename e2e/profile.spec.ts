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

    test.beforeEach(async ({ page, context }) => {
        // 1. Generate valid session token
        const token = await createSessionToken({ user: testUser });

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

        // 3. Navigate to profile page
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
