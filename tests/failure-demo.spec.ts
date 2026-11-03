
import { test, expect } from '@playwright/test';

test('Failure Analysis Demo - Intentional Assertion Failure', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');

    await expect(
        page.getByRole('heading', { name: 'Login' })
    ).toHaveText('Dashboard');
});
