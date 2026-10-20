import { test, expect } from '../fixtures/login.fixture';
import { users } from '../test-data/users';

test.describe('Leave Tests', () => {
    test('Leave page should be displayed @smoke', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Leave' }).click();

        await expect(
            page.getByRole('heading', { name: 'Leave', exact: true })
        ).toBeVisible();
    });

    test('Leave navigation options should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Leave' }).click();

        await expect(page.getByRole('link', { name: 'Apply' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'My Leave' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Leave List' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Assign Leave' })).toBeVisible();
    });

    test('Apply Leave page should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Leave' }).click();
        await page.getByRole('link', { name: 'Apply' }).click();

        await expect(
            page.getByRole('heading', { name: 'Apply Leave' })
        ).toBeVisible();

        await expect(page.getByText('Leave Type', { exact: true })).toBeVisible();
        await expect(page.getByText('From Date', { exact: true })).toBeVisible();
        await expect(page.getByText('To Date', { exact: true })).toBeVisible();
    });

    test('Leave Type availability should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Leave' }).click();
        await page.getByRole('link', { name: 'Apply' }).click();

        await expect(
            page.getByRole('heading', { name: 'Apply Leave' })
        ).toBeVisible();

        await expect(
            page.getByText('Leave Type', { exact: true })
        ).toBeVisible();

        await expect(
            page.getByText('Leave Balance', { exact: true })
        ).toBeVisible();

        await expect(
            page.getByText(/^\d+(?:\.\d+)? Day\(s\)$/)
        ).toBeVisible();
    });
});