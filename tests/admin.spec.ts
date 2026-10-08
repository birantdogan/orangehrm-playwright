import { test, expect } from '../fixtures/login.fixture';
import { AdminPage } from '../pages/AdminPage';
import { users } from '../test-data/users';

test.describe('Admin Tests', () => {
    test('Admin user list should be displayed @smoke', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await expect(adminPage.adminTitle).toBeVisible();
        await expect(adminPage.userRows.first()).toBeVisible();
    });

    test('Admin user should be searchable by username @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.usernameInput.fill('Admin');
        await adminPage.searchButton.click();

        const adminUserRow = page.getByRole('row').filter({
            hasText: 'Admin',
        });

        await expect(adminUserRow.first()).toBeVisible();
    });

    test('Admin users should be filterable by user role @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.userRoleSelect.click();
        await page.getByRole('option', { name: 'Admin', exact: true }).click();

        await adminPage.searchButton.click();

        const adminUserRows = adminPage.userRows.filter({
            has: page.getByText('Admin', { exact: true }),
        });

        await expect(adminUserRows.first()).toBeVisible();
    });

    test('Admin users should be filterable by status @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.statusSelect.click();
        await page.getByRole('option', { name: 'Enabled', exact: true }).click();

        await adminPage.searchButton.click();

        const enabledUserRows = adminPage.userRows.filter({
            has: page.getByText('Enabled', { exact: true }),
        });

        await expect(enabledUserRows.first()).toBeVisible();
    });

    test('Admin user details should be opened from user list @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.editButtons.first().click();

        await expect(
            page.getByRole('heading', { name: 'Edit User' })
        ).toBeVisible();

        const usernameInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Username', { exact: true }),
            })
            .locator('input');

        await expect(usernameInput).toHaveValue(/.+/);
    });

    test('Admin add user page should be displayed @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.addButton.click();

        await expect(adminPage.addUserTitle).toBeVisible();
    });
});