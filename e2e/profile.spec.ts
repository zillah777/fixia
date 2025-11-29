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
        // Wait for the heading to be visible, this ensures the page content has loaded
        const heading = page.getByRole('heading', { name: testUser.name });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        // Check email visibility
        const email = page.getByText(testUser.email);
        await email.scrollIntoViewIfNeeded();
        await expect(email).toBeVisible();
    });

    test('should allow editing profile', async ({ page }) => {
        // Click Edit - Ensure button is visible
        const editButton = page.getByRole('button', { name: /editar perfil/i });
        await editButton.scrollIntoViewIfNeeded();
        await editButton.click();

        // Change Name - Ensure input is visible
        const nameInput = page.getByLabel(/nombre completo/i);
        await expect(nameInput).toBeVisible();
        const newName = 'Updated Name';
        await nameInput.fill(newName);

        // Save - Ensure button is visible
        const saveButton = page.getByRole('button', { name: /guardar cambios/i });
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();

        // Verify Success Toast - Increase timeout for mobile
        await expect(page.getByText(/perfil actualizado correctamente/i)).toBeVisible({ timeout: 15000 });

        // Verify new name is displayed (persisted in UI state at least)
        const newHeading = page.getByRole('heading', { name: newName });
        await newHeading.scrollIntoViewIfNeeded();
        await expect(newHeading).toBeVisible();
    });
});
